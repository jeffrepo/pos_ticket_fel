odoo.define('pos_ticket_fel.ClientDetailsEdit', function(require) {
    'use strict';

    const { _t } = require('web.core');
    const ClientDetailsEdit = require('point_of_sale.ClientDetailsEdit');
    const Registries = require('point_of_sale.Registries');

    const POSTicketFelPartnerDetailsEdit = (ClientDetailsEdit) =>
        class extends ClientDetailsEdit {
            setup() {
                super.setup();
            }

            async saveChanges() {

              if("changes" in this && "vat" in this.changes){
                  if (this.changes.vat != "CF" || this.changes.vat != "cf" || this.changes.vat != "C/F"){
                    let vat_sat = await this.rpc({
                                model: 'pos.order',
                                method: 'get_vat_sat',
                                args: [[this.changes.vat], this.changes.vat, this.env.pos.company.id],
                            });

                    if (vat_sat == false){
                      return  this.showPopup('ErrorPopup', {
                              title: _t('NIT INVÁLIDO'),
                            });

                    }else{
                      this.changes.name = vat_sat;
                    }
                  }

              }
              super.saveChanges();
            }

        };

    Registries.Component.extend(ClientDetailsEdit, POSTicketFelPartnerDetailsEdit);

});
