import generateCSSDeclaration from '../../../src/libs/generateCSSDeclaration';

describe(`libs/generateCSSDeclaration`, () => {

  describe(`generateCSSDeclaration`, () => {
    it(`generates a css text string for a hyphenated declaration`, () => {
      const declaration = generateCSSDeclaration('backgroundColor', 'red');
      expect(declaration).to.be.equal('background-color:red');
    });

    it(`does appropriate hyphenation for vendor prefixes`, () => {
      const declaration = generateCSSDeclaration('MozTransition', 'translate3d(0,0,0)');
      expect(declaration).to.be.equal('-moz-transition:translate3d(0,0,0)');
    });
  });
});
