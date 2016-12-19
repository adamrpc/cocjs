'use strict';

angular.module( 'cocjs' ).factory( 'Armor', function( Useable, MainView, CoC, PerkLib ) {
	function Armor() {
		this.init(this, arguments);
	}
	angular.extend(Armor.prototype, Useable.prototype);
	Armor.prototype.init = function( that, args ) {
		Useable.prototype.init( that, [ args[ 0 ], args[ 1 ], args[ 3 ], args.length > 5 ? args[ 5 ] : 0, args.length > 6 ? args[ 6 ] : null ] );
		that.classNames.push('Armor');
		that.name = args[ 2 ];
		that.def = args[ 4 ];
		that.perk = args.length > 7 ? args[ 7 ] : '';
		that._supportsBulge = args.length > 8 ? args[ 8 ] : false;
	};
	Armor.prototype.supportsBulge = function() {
		return this._supportsBulge && CoC.player.modArmorName === '';
	};
	//For most clothes if the modArmorName is set then it's Exgartuan's doing. The comfortable clothes are the exception, they override this function.;
	Armor.prototype.useText = function() {
		MainView.outputText( 'You equip ' + this.longName + '.  ' );
	};
	Armor.prototype.playerEquip = function() { //This item is being equipped by the player. Add any perks, etc. - This function should only handle mechanics, not text output
		return this;
	};
	Armor.prototype.playerRemove = function() { //This item is being removed by the player. Remove any perks, etc. - This function should only handle mechanics, not text output
		while( CoC.player.findPerk( PerkLib.BulgeArmor ) >= 0 ) {
			CoC.player.removePerk( PerkLib.BulgeArmor );
		} //TODO remove this Exgartuan hack
		if( CoC.player.modArmorName.length > 0 ) {
			CoC.player.modArmorName = '';
		}
		return this;
	};
	Armor.prototype.removeText = function() {
	}; //Produces any text seen when removing the armor normally
	return Armor;
} );