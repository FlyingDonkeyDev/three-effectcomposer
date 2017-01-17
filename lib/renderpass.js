/**
 * @author alteredq / http://alteredqualia.com/
 */

module.exports = function (THREE) {
    function RenderPass(scene, camera, overrideMaterial, clearColor, clearAlpha) {
        if (!(this instanceof RenderPass)) return new RenderPass(scene, camera, overrideMaterial, clearColor, clearAlpha);

        this.scene = scene;
        this.camera = camera;

        this.overrideMaterial = overrideMaterial;

        this.clearColor = clearColor;
        this.clearAlpha = ( clearAlpha !== undefined ) ? clearAlpha : 0;

        this.clear = true;
        this.needsSwap = false;

    }

    RenderPass.prototype = {

        render: function (renderer, writeBuffer, readBuffer, delta, maskActive) {

            this.scene.overrideMaterial = this.overrideMaterial;

            var oldClearColor, oldClearAlpha;

            if (this.clearColor) {

                oldClearColor = renderer.getClearColor().getHex();
                oldClearAlpha = renderer.getClearAlpha();

                renderer.setClearColor(this.clearColor, this.clearAlpha);
            }

            renderer.render(this.scene, this.camera, this.renderToScreen ? null : readBuffer, this.clear);

            if (this.clearColor) {
                renderer.setClearColor(oldClearColor, oldClearAlpha);
            }

            this.scene.overrideMaterial = null;
        },

        setSize: function( width, height ) {

        }
    };

    return RenderPass;
};
