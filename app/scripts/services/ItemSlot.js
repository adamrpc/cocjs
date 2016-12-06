'use strict';

angular.module( 'cocjs' ).factory( 'ItemSlot', function( ItemType, CoC_Settings ) {
	function ItemSlot() {
		this.itype = ItemType.NOTHING;
		this._quantity = 0;
		this._unlocked = false;
	}

	ItemSlot.prototype.setItemAndQty = function( type, quant ) {
		if( type === null ) {
			type = ItemType.NOTHING;
		}
		if( quant === 0 && type === ItemType.NOTHING ) {
			this.emptySlot();
			return;
		}
		if( quant < 0 || quant === 0 && type !== ItemType.NOTHING || quant > 0 && type === ItemType.NOTHING ) {
			CoC_Settings.error( 'Inconsistent setItemAndQty call: ' + quant + ' ' + type );
			quant = 0;
			type = ItemType.NOTHING;
		}
		this._quantity = quant;
		this.itype = type;
	};

	ItemSlot.prototype.emptySlot = function() {
		this._quantity = 0;
		this.itype = ItemType.NOTHING;
	};
	ItemSlot.prototype.removeOneItem = function() {
		if( this._quantity === 0 ) {
			CoC_Settings.error( 'Tried to remove item from empty slot!' );
		}
		if( this._quantity > 0 ) {
			this._quantity -= 1;
		}
		if( this._quantity === 0 ) {
			this.itype = ItemType.NOTHING;
		}
	};
	ItemSlot.prototype.isEmpty = function() {
		return this._quantity <= 0;
	};

	var ItemSlotProxy = new Proxy( ItemSlot, {
		construct: function( target ) {
			return new Proxy( new target(), {
				get: function( target, name ) {
					if(_.has(target.prototype, name)) {
						return target.prototype[name];
					}
					if( name === 'quantity' ) {
						return target._quantity;
					}
					if( name === 'unlocked' ) {
						return target._unlocked;
					}
					return target[ name ];
				},
				set: function( target, name, value ) {
					if( name === 'quantity' ) {
						if( value > 0 && target.itype === null ) {
							CoC_Settings.error( 'ItemSlotClass.quantity set with no item; use setItemAndQty instead!' );
						}
						if( value === 0 ) {
							target.itype = ItemType.NOTHING;
						}
						target._quantity = value;
						return true;
					}
					if( name === 'unlocked' ) {
						if( target._unlocked !== value ) {
							target.emptySlot();
						}
						target._unlocked = value;
						return true;
					}
					target[ name ] = value;
					return true;
				}
			} );
		}
	} );
	return ItemSlotProxy;
} );