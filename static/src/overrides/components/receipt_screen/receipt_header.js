/** @odoo-module */

import { patch } from "@web/core/utils/patch";
import { usePos } from "@point_of_sale/app/store/pos_hook";
import { ReceiptHeader } from "@point_of_sale/app/screens/receipt_screen/receipt/receipt_header/receipt_header";


patch(ReceiptHeader.prototype, {
    setup() {
        super.setup(...arguments);
        this.pos = usePos();
        console.log("pos titicket fel Recipt header")
        console.log(this)
        this.currentOrder = this.pos.get_order();
        console.log("current order")
        console.log(this)
    },

});