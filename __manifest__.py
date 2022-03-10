# -*- coding: utf-8 -*-


{
    'name': 'POS TICKET FEL',
    'version': '1.0',
    'category': 'Hidden',
    'sequence': 6,
    'summary': 'TIKCET POS FEL',
    'description': """

""",
    'depends': ['point_of_sale'],
    'data': [
        'views/pos_order_view.xml',
    ],
    'assets': {
        'point_of_sale.assets': [
            'pos_ticket_fel/static/src/css/pos_ticket_fel.css',
            'pos_ticket_fel/static/src/js/qrcode.js',
            'pos_ticket_fel/static/src/js/Screens/ReceiptScreen/OrderReceipt.js',
            'pos_ticket_fel/static/src/xml/Screens/ReceiptScreen/OrderReceipt.xml',
        ],
        'web.assets_qweb': [
            'pos_ticket_fel/static/src/xml/**/*',
        ],
    },
    'license': 'LGPL-3',

    'installable': True,
    'auto_install': False,
}
