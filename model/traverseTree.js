export default rootNode => {

    const results = [];

    const inOrder = node => {
        if (node) {
            if (node.left !== null) {
                inOrder(node.left);
            }

            results.push(node);

            if (node.right !== null) {
                inOrder(node.right);
            }
        }
    };

    inOrder(rootNode);

    return results;

}