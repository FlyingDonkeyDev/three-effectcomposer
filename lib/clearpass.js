/**
 * @author alteredq / http://alteredqualia.com/
 */

module.exports = function(THREE) {
  function ClearPass() {
    if (!(this instanceof ClearPass)) return new ClearPass();
      this.needsSwap = false;
  }

    ClearPass.prototype = {
      render: function ( renderer, writeBuffer, readBuffer, delta, maskActive ) {

          renderer.setRenderTarget( readBuffer );
          renderer.clear();

      },
      setSize: function( width, height ) {

      }
  };

  return ClearPass
};