const postcss = require('postcss');
const vars = require('postcss-simple-vars');

module.exports = postcss.plugin('postcss-each-properties', () => {
	return css => {

    const processRule = (atRule, atNode, rule) => {
      const proxy = postcss.rule({ nodes: [atNode] });
      let vals = {}
		  rule.each(decl => {
        if(decl.prop) {
          vals['prop'] = decl.prop;
          vals['value'] = decl.value;
          const { root } = postcss([vars({ only: vals })]).process(proxy);
          atRule.parent.insertBefore(atRule, root.nodes[0].nodes[0]);
        }
		  });
    }

		css.walkAtRules('properties', atRule => {
      const selector = atRule.params
		  css.walkRules(rule => {
		    if (rule.selector === selector) {
          atRule.nodes.forEach(atNode => {
            processRule(atRule, atNode, rule)
		      });
          rule.remove()
		    }
      });
      atRule.remove()
		});
	};
});