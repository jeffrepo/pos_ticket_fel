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
        'point_of_sale._assets_pos': [
            'pos_ticket_fel/static/src/**/*',
        ],
    },
    'license': 'LGPL-3',

    'installable': True,
    'auto_install': False,
}
