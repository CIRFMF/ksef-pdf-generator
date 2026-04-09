#!/bin/bash

./KSeF-PDFGen \
-t invoice \
-i assets/invoice.xml \
-o ksef-exe-fa.pdf \
--nrKSeF "1111111111-20251107-080080679C57-14" \
--qrCode "https://qr.ksef.mf.gov.pl/invoice/{nip}/{p1}/{hash}" \
--qr2Code "https://qr.ksef.mf.gov.pl/certificate/Nip/1111111111/{nip}/01F20A5D352AE590/..."

./KSeF-PDFGen \
-t upo \
-i assets/upo.xml \
-o ksef-exe-upo.pdf
