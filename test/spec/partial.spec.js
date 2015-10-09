import { expect } from 'chai';
import partial from '../../lib/partial';

describe('partial', () => {
	it('should handle emptiness', () => {
		expect(partial()).to.be.an.object;
	});

	it('should handle single instances', () => {
		expect(partial({ color: 'red' }))
			.to.have.property('color', 'red');
	});

	it('should handle simple merges', () => {
		const result = partial(
			{ color: 'red', number: 5 },
			{ color: 'green', item: 'foo' }
		);
		expect(result).to.have.property('color', 'green');
		expect(result).to.have.property('number', 5);
		expect(result).to.have.property('item', 'foo');
	});

	it('should concatenate arrays', () => {
		expect(partial(
			{ items: [ 1 ]},
			{ items: [ 2 ]}
		)).to.have.property('items').to.have.length(2);
	});

	it('should merge named entries in arrays', () => {
		const result = partial(
			{ items: [ { name: 'foo', color: 'red', item: 4 } ] },
			{ items: [ { name: 'foo', color: 'green' } ] }
		);
		expect(result)
			.to.have.property('items')
			.to.have.length(1)
			.to.have.property(0)
			.to.have.property('color', 'green');
	});

	it('should handle functions', () => {
		expect(partial({ value: 1 }, ({ value }) => ({ value: value + 1 })))
			.to.have.property('value', 2);
	});

	it('should handle strings', () => {
		expect(partial('../fixtures/test.js'))
			.to.have.property('value', 5);
	});

	it('should overwrite entrypoints', () => {
		expect(partial(
			{ entry: { a: [ 1, 2 ] } },
			{ entry: { a: [ 3, 4 ] } }
		)).to.have.property('entry')
			.to.have.property('a')
			.to.have.length(2);
	});
});
