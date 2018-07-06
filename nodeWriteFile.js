var list = [{
    id: 10658,
    systemType: 'CoffeeHR',
    unitId: 3175,
    typeId: 8311,
    name: '交易履约平台',
    managerId: 85022,
    parentId: 5,
    isValid: true
}]

var result = list.map(function (x) {
    return {
        unitId: x.unitId,
        name: x.name
    }
})

var path = require('path')
var fs = require('fs')
var note = JSON.stringify(result)

fs.writeFile('haha.json', note, function (e) {
    console.log('e')
})

new UglifyJsPlugin({
    uglifyOptions: {
        compress: {
            warnings: false
        },
        mangle: {
            safari10: true
        }
    },
    sourceMap: config.build.productionSourceMap,
    parallel: true
})