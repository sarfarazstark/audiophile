class Rate {
	private shippingPrice: number = 60;
	private vat: number = 0.2;
	private value: number;
	constructor(value: number) {
		this.value = value;
	}

	getTotalPrice() {
		return this.value + this.shippingPrice + this.value * this.vat;
	}

	getShippingPrice() {
		return this.shippingPrice;
	}

	getVatPrice() {
		return this.value * this.vat;
	}

	getVatRate() {
		return this.vat;
	}
}

export default Rate;
