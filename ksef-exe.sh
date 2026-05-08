#!/bin/bash

./KSeF-PDFGen \
-t invoice \
-i assets/invoice.xml \
--nrKSeF "1111111111-20251107-080080679C57-14" \
--qrCode "https://qr.ksef.mf.gov.pl/invoice/{nip}/{p1}/{hash}" \
-o ksef-exe-fa-online.pdf

./KSeF-PDFGen \
-t invoice \
-i assets/invoice.xml \
--nrKSeF "1111111111-20251107-080080679C57-14" \
--qrCode "https://qr.ksef.mf.gov.pl/invoice/{nip}/{p1}/{hash}" \
--qr2Code "https://qr.ksef.mf.gov.pl/certificate/Nip/1111111111/{nip}/01F20A5D352AE590/..." \
-o ksef-exe-fa-offline.pdf

./KSeF-PDFGen \
-t invoice \
-i assets/invoice.xml \
--nrKSeF "1111111111-20251107-080080679C57-14" \
--qrCode "https://qr.ksef.mf.gov.pl/invoice/{nip}/{p1}/{hash}" \
-o ksef-exe-fa-online.html \
--html

./KSeF-PDFGen \
-t invoice \
-i assets/invoice.xml \
--nrKSeF "1111111111-20251107-080080679C57-14" \
--qrCode "https://qr.ksef.mf.gov.pl/invoice/{nip}/{p1}/{hash}" \
--qr2Code "https://qr.ksef.mf.gov.pl/certificate/Nip/1111111111/{nip}/01F20A5D352AE590/..." \
-o ksef-exe-fa-offline.html \
--html

./KSeF-PDFGen \
-t upo \
-i assets/upo.xml \
-o ksef-exe-upo.pdf

./KSeF-PDFGen \
-t upo \
-i assets/upo.xml \
-o ksef-exe-upo.html \
--html
