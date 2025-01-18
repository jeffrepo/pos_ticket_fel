/** @odoo-module */

import { patch } from "@web/core/utils/patch";
import { usePos } from "@point_of_sale/app/store/pos_hook";
import { OrderReceipt } from "@point_of_sale/app/screens/receipt_screen/receipt/order_receipt";


patch(OrderReceipt.prototype, {
    setup() {
        super.setup(...arguments);
        this.pos = usePos();
        this._nuevo_numero = this.pos.get_order().nuevo_numero;
        this.currentOrder = this.pos.get_order();
        console.log("OrderReceipt")
        console.log(OrderReceipt)

    },
    
    get NuevoNumero(){
        return "1234";
    },
    
});