QUnit.test( "hello test", function( assert ) {
    var rootNode = {
        isPositioned : false,
        right : {
            isPositioned: true,
            left : null,
            value : "A",
            right : null
        },
        value : "B",
        right : {
            isPositioned: true,
            left : null,
            value : "C",
            right : null
        }
    };

    var reorderedNodes = traverseTree(rootNode);

    assert.ok( reorderedNodes == ["A","B","C"], "Passed!" );
});