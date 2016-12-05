'use strict';

angular.module('cocjs').factory('WeaponLib', function ( Weapon ) {
	var weapons = {};
	function WeaponLib() {}
	WeaponLib.prototype.registerWeapon = function(name, weapon) {
		weapons[name] = weapon;
	};
	var WeaponLibProxy = new Proxy( WeaponLib, {
		construct: function( target ) {
			return new Proxy( target, {
				get: function( target, name ) {
					if(_.has(target.prototype, name)) {
						return target.prototype[name];
					}
					if(_.has(armors, name) ) {
						return weapons[ name ];
					}
					return target[ name ];
				},
				set: function( target, name, value ) {
					return;
				}
			} );
		}
	} );
	var instance = new WeaponLibProxy();
	
	instance.registerWeapon( 'URTAHLB', new Weapon('UrtaHlb','UrtaHlb','halberd','a halberd','slash',11,10,null,'Large') );
	instance.registerWeapon( 'H_GAUNT', new Weapon('H.Gaunt','H.Gaunt','hooked gauntlets','a set of hooked gauntlets','clawing punch',8,300,'These metal gauntlets are covered in nasty looking hooks that are sure to tear at your foes flesh and cause them harm.') );
	instance.registerWeapon( 'KATANA', new Weapon('Katana ','Katana','katana','a katana','keen cut',10,500,'A curved bladed weapon that cuts through flesh with the greatest of ease. (ATK: 10) (Cost: 500)') );
	instance.registerWeapon( 'L__AXE', new Weapon('L. Axe ','L. Axe ','large axe','an axe large enough for a minotaur','cleave',15,100,'This massive axe once belonged to a minotaur.  It\'d be hard for anyone smaller than a giant to wield effectively.  The axe is double-bladed and deadly-looking.  (ATK: +15) (Cost: 100)','Large') );
	instance.registerWeapon( 'L_DAGGR', new Weapon('L.Daggr','L.Daggr','lust-enchanted dagger','an aphrodisiac-coated dagger','stab',3,150,'A dagger with a short blade in a wavy pattern.  Its edge seems to have been enchanted to always be covered in a light aphrodisiac to arouse anything cut with it.','Aphrodisiac Weapon') );
	instance.registerWeapon( 'PIPE', new Weapon('Pipe   ','Pipe   ','pipe','a pipe','smash',5,25,'This is a simple rusted pipe of unknown origins.  It\'s hefty and could probably be used as an effective bludgeoning tool. (ATK: +5) (Cost: 25)') );
	instance.registerWeapon( 'RIDINGC', new Weapon('RidingC','RidingC','riding crop','a riding crop','whip-crack',5,50,'This riding crop appears to be made of black leather, and could be quite a painful (or exciting) weapon.  (ATK: +5) (Cost: 50)') );
	instance.registerWeapon( 'S_GAUNT', new Weapon('S.Gaunt','S.Gauntlet','spiked gauntlet','a spiked gauntlet','spiked punch',5,400,'This single metal gauntlet has the knuckles tipped with metal spikes.  Though it lacks the damaging potential of other weapons, the sheer pain of its wounds has a chance of stunning your opponent. (ATK: 5) (Cost: 400)') );
	instance.registerWeapon( 'SPEAR', new Weapon('Spear  ','Spear','deadly spear','a deadly spear','piercing stab',8,450,'A staff with a sharp blade at the tip designed to pierce through the toughest armor.  This would ignore most armors.  (ATK: 8) (Cost: 450)') );
	instance.registerWeapon( 'SUCWHIP', new Weapon('SucWhip','SucWhip','succubi whip','a succubi whip','sexy whipping',10,400,'This coiled length of midnight-black leather practically exudes lust.  Though it looks like it could do a lot of damage, the feel of that slick leather impacting flesh is sure to inspire lust.') );
	instance.registerWeapon( 'WHIP', new Weapon('Whip   ','Whip','coiled whip','a coiled whip','whip-crack',5,500,'A coiled length of leather designed to lash your foes into submission.  There\'s a chance the bondage inclined might enjoy it! (ATK: 5) (Cost: 500)') );
	
	return instance;
});