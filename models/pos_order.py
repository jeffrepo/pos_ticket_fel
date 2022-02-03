# -*- coding: utf-8 -*-
from odoo import api, fields, models, _
import logging

class PosOrder(models.Model):
    _inherit = "pos.order"

    contingencia = fields.Char("Numero de contingencia")

    @api.model
    def _order_fields(self, ui_order):
        res = super(PosOrder, self)._order_fields(ui_order)
        if 'contingencia' in ui_order:
            res['contingencia'] = ui_order['contingencia']
        return res
