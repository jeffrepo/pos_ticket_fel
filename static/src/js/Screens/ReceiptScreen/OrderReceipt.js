odoo.define('pos_ticket_fel.OrderReceipt', function(require) {
    'use strict';



    const OrderReceipt = require('point_of_sale.OrderReceipt');
    const Registries = require('point_of_sale.Registries');
    const { useState, useContext } = owl.hooks;

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
                  'direccion': false,
                  'certificador_fel': false,
                });

                var state = this.state;
                console.log(order)
                self.rpc({
                    model: 'pos.order',
                    method: 'search_read',
                    args: [[['pos_reference', '=', order.name]], []],
                }, {
                    timeout: 5000,
                }).then(function (orders) {
                    if (orders.length > 0 && 'account_move' in orders[0] && orders[0]['account_move'].length > 0) {
                        console.log(orders)
                        console.log("primer rpc")
                          self.rpc({
                            model: 'account.move',
                            method: 'search_read',
                            args: [[['id', '=', orders[0]['account_move'][0]  ]], []],
                        }, {
                            timeout: 5000,
                        }).then(function (facturas) {
                            if (facturas.length > 0) {
                                console.log('FACTURAS')
                                console.log(facturas)

                                // var receipt_env = self.get_receipt_render_env();
                                //
                                // console.log(order)


                                  self.rpc({
                                    model: 'account.journal',
                                    method: 'search_read',
                                    args: [[['id', '=', facturas[0].journal_id[0]  ]], []],
                                }, {
                                    timeout: 5000,
                                }).then(function (diario) {
                                    console.log(diario)
                                    // var direccion_id = self.pos.db.get_partner_by_id(diario[0]['direccion_id'][0]);
                                    // console.log(direccion_id)
                                    // console.log(order)
                                    state.feel_numero_autorizacion = facturas[0].feel_numero_autorizacion;
                                    state.feel_serie = facturas[0].feel_serie;
                                    state.feel_numero = facturas[0].feel_numero;
                                    // state.nombre_diario = direccion_id.name;
                                    // state.direccion = direccion_id.street +" " + direccion_id.street2 + ", " + direccion_id.city;
                                    state.certificador_fel = 'DIGIFACT';
                                    var link = ["https://felgtaws.digifact.com.gt/guest/api/FEL?DATA=",self.env.pos.company.vat.toString(), "%", "7C", facturas[0].feel_numero_autorizacion.toString(),"%7CGUESTUSERQR"].join('');
                                    console.log(link)
                                    state.qr_string = link;
                                  // console.log(receipt_env)
                                  // self.$('.pos-receipt-container').html(QWeb.render('PosTicket', receipt_env));
                                });
                                // receipt_env['feel_uuid'] = facturas[0].feel_uuid;
                                // receipt_env['feel_serie'] = facturas[0].feel_serie;
                                // receipt_env['feel_numero'] = facturas[0].feel_serie;
                                // receipt_env['certificador_fel'] = 'INFILE';
                                //
                                // console.log(receipt_env)
                                // self.$('.pos-receipt-container').html(QWeb.render('PosTicket', receipt_env));
                            }
                        });



                    }
                });
            }
        };



    Registries.Component.extend(OrderReceipt, PosTicketFelOrderReceipt);

    return OrderReceipt;

});
