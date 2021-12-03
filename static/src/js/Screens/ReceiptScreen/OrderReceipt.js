odoo.define('pos_ticket_fel.OrderReceipt', function(require) {
    'use strict';

    var models = require('point_of_sale.models');
    const OrderReceipt = require('point_of_sale.OrderReceipt');
    const Registries = require('point_of_sale.Registries');
    const { useState, useContext } = owl.hooks;

    models.load_fields('account.journal','direccion_sucursal');
    models.load_fields('res.company','certificador');
    models.load_fields('account.journal','direccion_id');

    models.load_models({
        model: 'account.journal',
        fields: [],
        domain: function(self){ return []; },
        loaded: function(self,journals){
            self.direccion_diario = "";
            self.telefono = "";
            if (journals.length > 0) {
                journals.forEach(function(journal) {
                    if ('direccion' in journal){
                        self.direccion_diario = journal.direccion_sucursal;
                        if (journal.id == self.config.invoice_journal_id[0]){
                            self.direccion_diario = journal.direccion_sucursal || journal.direccion_id;
                            self.telefono = journal.telefono;
                        }
                    }else{
                        if('direccion_id' in journal){
                            if (journal.id == self.config.invoice_journal_id[0]){
                                self.rpc({
                                  model: 'res.partner',
                                  method: 'search_read',
                                  args: [[['id', '=',   journal['direccion_id'][0]]], []],
                              }, {
                                  timeout: 5000,
                              }).then(function (direc) {
                                  self.direccion_diario = direc[0]['contact_address_complete'];
                                  self.nombre_comercial = journal.fel_nombre_comercial
                              });

                            }
                        }
                    }

                })

            }
        },
    });

    const PosTicketFelOrderReceipt = OrderReceipt =>
        class extends OrderReceipt {
            constructor() {
                super(...arguments);
                var order = this.env.pos.get_order();
                var self = this;
                this.state = useState({
                  'cliente_id': order.get_client(),
                  'qr_string': false,
                  // 'qr_string': "https://felgtaws.digifact.com.gt/guest/api/FEL?DATA=96524081%7CB96A30D0-22FC-44D2-8900-A4F1103A0AB7%7CGUESTUSERQR",
                  'feel_numero_autorizacion': false,
                  'feel_serie': false,
                  'feel_numero': false,
                  'nombre_diario': false,
                  'nombre_comercial': order.pos.nombre_comercial|| '',
                  'direccion': order.pos.direccion_diario,
                  'certificador': order.pos.company.certificador,
                  'telefono': order.pos.telefono,
                });

                var state = this.state;
                self.rpc({
                    model: 'pos.order',
                    method: 'search_read',
                    args: [[['pos_reference', '=', order.name]], []],
                }, {
                    timeout: 5000,
                }).then(function (orders) {
                    if (orders.length > 0 && 'account_move' in orders[0] && orders[0]['account_move'].length > 0) {
                          self.rpc({
                            model: 'account.move',
                            method: 'search_read',
                            args: [[['id', '=', orders[0]['account_move'][0]  ]], []],
                        }, {
                            timeout: 5000,
                        }).then(function (facturas) {
                            if (facturas.length > 0) {
                                  self.rpc({
                                    model: 'account.journal',
                                    method: 'search_read',
                                    args: [[['id', '=', facturas[0].journal_id[0]  ]], []],
                                }, {
                                    timeout: 5000,
                                }).then(function (diario) {
                                    state.feel_numero_autorizacion = facturas[0].feel_numero_autorizacion || facturas[0].fel_numero_autorizacion;
                                    state.feel_serie = facturas[0].feel_serie || facturas[0].fel_serie;
                                    state.feel_numero = facturas[0].feel_numero || facturas[0].fel_numero;
                                    state.direccion = self.direccion_diario;
                                    var link = "";
                                    if (state.certificador == "INFILE"){
                                        var link = ["https://report.feel.com.gt/ingfacereport/ingfacereport_documento?","uuid=",state.feel_numero_autorizacion.toString() ].join('');

                                    }else{
                                        var link = ["https://felgtaws.digifact.com.gt/guest/api/FEL?DATA=",self.env.pos.company.vat.toString(), "%", "7C", facturas[0].feel_numero_autorizacion.toString(),"%7CGUESTUSERQR"].join('');

                                    }
                                    state.qr_string = link;
                                });
                            }
                        });



                    }
                });
            }
        };



    Registries.Component.extend(OrderReceipt, PosTicketFelOrderReceipt);

    return OrderReceipt;

});
