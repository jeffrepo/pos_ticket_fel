# -*- coding: utf-8 -*-
from odoo import api, fields, models, _
import requests
from lxml import etree
from lxml.builder import ElementMaker
import xml.etree.ElementTree as ET

import logging

class PosOrder(models.Model):
    _inherit = "pos.order"

    acceso = fields.Char("Numero de acceso")

    @api.model
    def _order_fields(self, ui_order):
        res = super(PosOrder, self)._order_fields(ui_order)
        if 'acceso' in ui_order:
            res['acceso'] = ui_order['acceso']
        return res

    def get_vat_sat(self, vat, company):
        vat_sat = False
        url = "https://consultareceptores.feel.com.gt/rest/action"

        company_id = self.env['res.company'].search([('id','=', company)])
        nuevo_json = {
            'emisor_codigo': str(company_id.fel_usuario),
            'emisor_clave': str(company_id.fel_llave_firma),
            'nit_consulta': vat,
        }
        nuevos_headers = {"content-type": "application/json"}
        response = requests.post(url, json = nuevo_json, headers = nuevos_headers)
        respone_json=response.json()

        if "nit" in respone_json and "nombre" in respone_json and  respone_json["nombre"]:
            vat_sat = respone_json["nombre"]
        partner_id = self.env['res.partner'].search([('vat','=', vat)])
        if partner_id:
            vat_sat = False
        return vat_sat
