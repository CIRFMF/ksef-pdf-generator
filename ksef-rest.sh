#!/bin/bash

curl \
--output ksef-rest-invoice.pdf \
--data-binary '@assets/invoice.xml' \
-H 'content-type: application/xml' \
-H "X-KSEF-NUMBER: 1111111111-20251107-080080679C57-14" \
-H "X-KSEF-QRCODE: https://qr.ksef.mf.gov.pl/invoice/{nip}/{p1}/{hash}" \
-X POST http://localhost:3000/invoice

curl \
--output ksef-rest-upo.pdf \
--data-binary '@assets/upo.xml' \
-H 'content-type: application/xml' \
-X POST http://localhost:3000/upo
