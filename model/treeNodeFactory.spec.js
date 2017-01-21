import treeNodeFactory from "./treeNodeFactory"

describe('treeNodeFactory',() => {
    it('should set the correct value to the node', () => {
        const VALUE = "THIS IS SPARTA"
        const result = treeNodeFactory(VALUE)
        expect(result.value).toBe(VALUE)
    })
})