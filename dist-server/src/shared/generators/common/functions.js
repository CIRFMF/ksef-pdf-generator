"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.translateMap = translateMap;
exports.formatDateTime = formatDateTime;
exports.getDateTimeWithoutSeconds = getDateTimeWithoutSeconds;
exports.formatTime = formatTime;
function translateMap(value, map) {
    let valueToTranslate = typeof value === 'string' ? value : value?._text;
    valueToTranslate = valueToTranslate?.trim();
    if (!valueToTranslate || !map[valueToTranslate]) {
        return '';
    }
    return map[valueToTranslate];
}
function formatDateTime(data, withoutSeconds, withoutTime) {
    if (!data) {
        return '';
    }
    const dateTime = new Date(data);
    if (isNaN(dateTime.getTime())) {
        return data;
    }
    const year = dateTime.getFullYear();
    const month = (dateTime.getMonth() + 1).toString().padStart(2, '0');
    const day = dateTime.getDate().toString().padStart(2, '0');
    const hours = dateTime.getHours().toString().padStart(2, '0');
    const minutes = dateTime.getMinutes().toString().padStart(2, '0');
    const seconds = dateTime.getSeconds().toString().padStart(2, '0');
    if (withoutTime) {
        return `${day}.${month}.${year}`;
    }
    else if (withoutSeconds) {
        return `${day}.${month}.${year} ${hours}:${minutes}`;
    }
    return `${day}.${month}.${year} ${hours}:${minutes}:${seconds}`;
}
function getDateTimeWithoutSeconds(isoDate) {
    if (!isoDate?._text) {
        return '';
    }
    return formatDateTime(isoDate._text, true);
}
function formatTime(data, withoutSeconds) {
    if (!data) {
        return '';
    }
    const dateTime = new Date(data);
    if (isNaN(dateTime.getTime())) {
        return data;
    }
    const hours = dateTime.getHours().toString().padStart(2, '0');
    const minutes = dateTime.getMinutes().toString().padStart(2, '0');
    const seconds = dateTime.getSeconds().toString().padStart(2, '0');
    if (withoutSeconds) {
        return `${hours}:${minutes}`;
    }
    return `${hours}:${minutes}:${seconds}`;
}
