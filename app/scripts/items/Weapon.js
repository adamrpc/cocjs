'use strict';

angular.module( 'cocjs' ).factory( 'Weapon', function( Useable, MainView ) {
	function Weapon() {
		this.init(this, arguments);
	}
	angular.extend(Weapon.prototype, Useable.prototype);
	Weapon.prototype.init = function( that, args ) {
		Useable.prototype.init( that, [ args[ 0 ], args[ 1 ], args[ 3 ], args.length > 6 ? args[ 6 ] : 0, args.length > 7 ? args[ 7 ] : null ] );
		that.classNames.push('Weapon');
		that.name = args[ 2 ];
		that.verb = args[ 4 ];
		that.attack = args[ 5 ];
		that.perk = args.length > 8 ? args[ 8 ] : '';
	};
	Weapon.prototype.useText = function() {
		MainView.outputText( 'You equip ' + this.longName + '.  ' );
	};
	Weapon.prototype.playerEquip = function() { //This item is being equipped by the player. Add any perks, etc. - This function should only handle mechanics, not text output
		return this;
	};
	Weapon.prototype.playerRemove = function() { //This item is being removed by the player. Remove any perks, etc. - This function should only handle mechanics, not text output
		return this;
	};
	Weapon.prototype.removeText = function() {
	}; //Produces any text seen when removing the armor normally
	return Weapon;
} );