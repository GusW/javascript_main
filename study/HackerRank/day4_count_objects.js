function getCount(objects) {
    const filteredObjs = objects.filter(item => item.x === item.y);
    return filteredObjs.length;
}
