'use strict';

angular.module( 'cocjs' ).factory( 'ArmorWithPerk', function( Armor, CoC ) {
	function ArmorWithPerk() {
		this.init(this, arguments);
	}
	angular.extend(ArmorWithPerk.prototype, Armor.prototype);
	ArmorWithPerk.prototype.init = function( that, args ) {
		Armor.prototype.init( that, [ args[ 0 ], args[ 1 ], args[ 2 ], args[ 3 ], args[ 4 ], args[ 5 ], args[ 6 ], args[ 7 ], args.length > 14 ? args[ 14 ] : false ] );
		that.classNames.push('ArmorWithPerk');
		that.playerPerk = args[ 8 ];
		that.playerPerkV1 = args[ 9 ];
		that.playerPerkV2 = args[ 10 ];
		that.playerPerkV3 = args[ 11 ];
		that.playerPerkV4 = args[ 12 ];
	};
	ArmorWithPerk.prototype._superPlayerEquip = ArmorWithPerk.prototype.playerEquip;
	ArmorWithPerk.prototype.playerEquip = function() { //This item is being equipped by the player. Add any perks, etc.
		while( CoC.player.findPerk( this.playerPerk ) ) {
			CoC.player.removePerk( this.playerPerk );
		}
		CoC.player.createPerk( this.playerPerk, this.playerPerkV1, this.playerPerkV2, this.playerPerkV3, this.playerPerkV4 );
		return this._superPlayerEquip();
	};
	ArmorWithPerk.prototype._superPlayerRemove = ArmorWithPerk.prototype.playerRemove;
	ArmorWithPerk.prototype.playerRemove = function() { //This item is being removed by the player. Remove any perks, etc.
		while( CoC.player.findPerk( this.playerPerk ) ) {
			CoC.player.removePerk( this.playerPerk );
		}
		return this._superPlayerRemove();
	};
	return ArmorWithPerk;
} );