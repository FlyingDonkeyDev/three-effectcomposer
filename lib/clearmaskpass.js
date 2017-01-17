/**
 * @author alteredq / http://alteredqualia.com/
 */

module.exports = function(THREE) {
  function ClearMaskPass() {
    if (!(this instanceof ClearMaskPass)) return new ClearMaskPass(scene, camera);
      this.needsSwap = false;
  }

  ClearMaskPass.prototype = {
      render: function ( renderer, writeBuffer, readBuffer, delta, maskActive ) {
          renderer.state.buffers.stencil.setTest(false);
      },
      setSize: function( width, height ) {

      }
  };

  return ClearMaskPass
};