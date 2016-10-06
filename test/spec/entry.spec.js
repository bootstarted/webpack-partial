import {expect} from 'chai';
import {flatMap, append, prepend, replace} from '../../lib/entry';

describe('entry', () => {

  const configs = {
    string: {
      entry: 'a.js',
    },
    array: {
      entry: ['a.js', 'b.js'],
    },
    object: {
      entry: {
        a: 'a.js',
        b: ['b.js', 'c.js'],
      },
    },
    error: {
      entry: false,
    },
  };

  describe('flatMap', () => {
    it('should handle strings', () => {
      expect(flatMap(
        (entries) => [...entries, 'b.js', 'c.js'],
        configs.string
      )).to.have.property('entry').to.deep.equal([
        'a.js', 'b.js', 'c.js'
      ]);
    });

    it('should handle arrays', () => {
      expect(flatMap(
        (entries) => [...entries, 'c.js', 'd.js'],
        configs.array
      )).to.have.property('entry').to.deep.equal([
        'a.js', 'b.js', 'c.js', 'd.js'
      ]);
    });

    it('should handle objects', () => {
      expect(flatMap(
        (entries, key) => key === 'a' ?
          [...entries, 'b.js', 'c.js'] : ['a.js', ...entries],
        configs.object
      ))
      .to.have.property('entry')
      .to.deep.equal({
        a: ['a.js', 'b.js', 'c.js'],
        b: ['a.js', 'b.js', 'c.js'],
      })
    });

    it('should throw on error cases', () => {
      expect(() => {
        flatMap(() => [], configs.error);
      }).to.throw(TypeError);
    });
  });

  describe('append', () => {
    it('should work', () => {
      expect(append(
        'b.js',
        configs.string
      )).to.have.property('entry').to.deep.equal(['a.js', 'b.js']);
    });
  });

  describe('prepend', () => {
    it('should work', () => {
      expect(prepend(
        'b.js',
        configs.string
      )).to.have.property('entry').to.deep.equal(['b.js', 'a.js']);
    });
  });

  describe('replace', () => {
    it('should work', () => {
      expect(replace(
        'foo.js',
        configs.string
      )).to.have.property('entry').to.equal('foo.js');
    });
    it('should accept functions work', () => {
      expect(replace(
        () => 'foo.js',
        configs.string
      )).to.have.property('entry').to.equal('foo.js');
    });
  });


});
