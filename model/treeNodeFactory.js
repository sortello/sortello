export default value => {

    const toReturn = {
        left:null,
        right:null,
        value,
        isPositioned:false
    }

    toReturn.goLeft =  function(parentNode){
        if(parentNode.left != null){
            return parentNode.left;
        }else{
            parentNode.left = this;
            toReturn.isPositioned = true;
            return false;
        }
    }

    toReturn.goRight = function(parentNode){
        if(parentNode.right != null){
            return parentNode.right;
        }else{
            parentNode.right = this;
            toReturn.isPositioned = true;
            return false;
        }
    }

    return toReturn
}