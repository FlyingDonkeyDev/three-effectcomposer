/**
 * @author alteredq / http://alteredqualia.com/
 */

module.exports = function (THREE) {
    var CopyShader              = EffectComposer.CopyShader             = require('./lib/shaders/copy')
        , ConvolutionShader     = EffectComposer.ConvolutionShader      = require('./lib/shaders/convolution')
        , BlendShader           = EffectComposer.BlendShader            = require('./lib/shaders/blend')
        , BlurShader            = EffectComposer.BlurShader             = require('./lib/shaders/blur')
        , VBlurShader           = EffectComposer.VBlurShader            = require('./lib/shaders/blurV')
        , HBlurShader           = EffectComposer.HBlurShader            = require('./lib/shaders/blurH')
        , BrightContrastShader  = EffectComposer.BrightContrastShader   = require('./lib/shaders/brightConstrast')
        , FXAAShader            = EffectComposer.FXAAShader             = require('./lib/shaders/fxaa')
        , HueSaturationShader   = EffectComposer.HueSaturationShader    = require('./lib/shaders/hueSaturation')
        , NoiseShader           = EffectComposer.NoiseShader            = require('./lib/shaders/noise')
        , RenderTargetShader    = EffectComposer.RenderTargetShader     = require('./lib/shaders/renderTarget')
        , SharpShader           = EffectComposer.SharpShader            = require('./lib/shaders/sharp')
        , PhotoEditShader       = EffectComposer.PhotoEditShader        = require('./lib/shaders/photoEdit')
        , FresnelShader         = EffectComposer.FresnelShader          = require('./lib/shaders/fresnel');

    var RenderPass      = EffectComposer.RenderPass     = require('./lib/renderpass')(THREE)
        , ShaderPass    = EffectComposer.ShaderPass     = require('./lib/shaderpass')(THREE, EffectComposer)
        , BloomPass     = EffectComposer.BloomPass      = require('./lib/bloompass')(THREE, EffectComposer)
        , MaskPass      = EffectComposer.MaskPass       = require('./lib/maskpass')(THREE)
        , ClearMaskPass = EffectComposer.ClearMaskPass  = require('./lib/clearmaskpass')(THREE)
        , ClearPass     = EffectComposer.ClearPass      = require('./lib/clearpass')(THREE);

    function EffectComposer(renderer, renderTarget) {

        this.renderer = renderer;

        if (renderTarget === undefined) {

            var parameters = {
                minFilter: THREE.LinearFilter,
                magFilter: THREE.LinearFilter,
                format: THREE.RGBAFormat,
                stencilBuffer: false
            };
            var size = renderer.getSize();
            renderTarget = new THREE.WebGLRenderTarget(size.width, size.height, parameters);

        }

        this.renderTarget1 = renderTarget;
        this.renderTarget2 = renderTarget.clone();

        this.writeBuffer = this.renderTarget1;
        this.readBuffer = this.renderTarget2;

        this.passes = [];

        if (CopyShader === undefined)
            console.error("THREE.EffectComposer relies on THREE.CopyShader");

        this.copyPass = new ShaderPass(CopyShader);
    }

    EffectComposer.prototype = {
        swapBuffers: function () {
            var tmp = this.readBuffer;
            this.readBuffer = this.writeBuffer;
            this.writeBuffer = tmp;

        },

        addPass: function (pass) {
            this.passes.push(pass);
            var size = this.renderer.getSize();
            pass.setSize(size.width, size.height);

        },

        insertPass: function (pass, index) {

            this.passes.splice(index, 0, pass);

        },

        render: function (delta) {

            var maskActive = false;

            var pass, i, il = this.passes.length;

            for (i = 0; i < il; i++) {

                pass = this.passes[i];

                if (pass.enabled === false) continue;

                pass.render(this.renderer, this.writeBuffer, this.readBuffer, delta, maskActive);

                if (pass.needsSwap) {

                    if (maskActive) {

                        var context = this.renderer.context;

                        context.stencilFunc(context.NOTEQUAL, 1, 0xffffffff);

                        this.copyPass.render(this.renderer, this.writeBuffer, this.readBuffer, delta);

                        context.stencilFunc(context.EQUAL, 1, 0xffffffff);

                    }

                    this.swapBuffers();

                }

                if (THREE.MaskPass !== undefined) {

                    if (pass instanceof THREE.MaskPass) {

                        maskActive = true;

                    } else if (pass instanceof THREE.ClearMaskPass) {

                        maskActive = false;

                    }

                }

            }

        },

        reset: function (renderTarget) {

            if (renderTarget === undefined) {

                var size = this.renderer.getSize();

                renderTarget = this.renderTarget1.clone();
                renderTarget.setSize(size.width, size.height);

            }

            this.renderTarget1.dispose();
            this.renderTarget2.dispose();
            this.renderTarget1 = renderTarget;
            this.renderTarget2 = renderTarget.clone();

            this.writeBuffer = this.renderTarget1;
            this.readBuffer = this.renderTarget2;
        },

        setSize: function (width, height) {

            this.renderTarget1.setSize(width, height);
            this.renderTarget2.setSize(width, height);

            for (var i = 0; i < this.passes.length; i++) {

                this.passes[i].setSize(width, height);

            }
        }

    };

    // shared ortho camera

    EffectComposer.camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

    EffectComposer.quad = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), null);

    EffectComposer.scene = new THREE.Scene();
    EffectComposer.scene.add(EffectComposer.quad);

    return EffectComposer
};