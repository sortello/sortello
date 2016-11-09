function TreeNode(value) {
    this.left = null;
    this.value = value;
    this.right = null;
    this.isPositioned = false;
}

TreeNode.prototype = {

    constructor: TreeNode,

    goLeft: function(parentNode){
        if(parentNode.left != null){
            return parentNode.left;
        }else{
            parentNode.left = this;
            this.isPositioned = true;
            return false;
        }
    },

    goRight: function(parentNode){
        if(parentNode.right != null){
            return parentNode.right;
        }else{
            parentNode.right = this;
            this.isPositioned = true;
            return false;
        }
    },
};

function traverseTree(RootNode){

    results = [];

    function inOrder(node){
        if (node){
            if (node.left !== null){
                inOrder(node.left);
            }

            results.push(node);

            if (node.right !== null){
                inOrder(node.right);
            }
        }
    }

    inOrder(RootNode);

    return results;

}
