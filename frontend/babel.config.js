module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      function({ types: t }) {
        return {
          name: 'transform-jsx-classname-to-twrnc',
          visitor: {
            JSXElement(path, state) {
              const filename = state.filename || '';
              if (!filename.includes('src') && !filename.endsWith('App.jsx')) return;

              const openingElement = path.node.openingElement;
              const attributes = openingElement.attributes;

              let classNameAttrIndex = -1;
              let styleAttrIndex = -1;

              attributes.forEach((attr, idx) => {
                if (t.isJSXAttribute(attr) && attr.name && attr.name.name) {
                  if (attr.name.name === 'className') classNameAttrIndex = idx;
                  if (attr.name.name === 'style') styleAttrIndex = idx;
                }
              });

              if (classNameAttrIndex !== -1) {
                const classAttr = attributes[classNameAttrIndex];
                const valueNode = classAttr.value;

                let classExpr = null;
                if (t.isStringLiteral(valueNode)) {
                  classExpr = valueNode;
                } else if (t.isJSXExpressionContainer(valueNode)) {
                  classExpr = valueNode.expression;
                }

                if (classExpr) {
                  const twStyleCall = t.callExpression(
                    t.memberExpression(
                      t.memberExpression(
                        t.callExpression(t.identifier('require'), [t.stringLiteral('twrnc')]),
                        t.identifier('default')
                      ),
                      t.identifier('style')
                    ),
                    [classExpr]
                  );

                  if (styleAttrIndex !== -1) {
                    const existingStyleAttr = attributes[styleAttrIndex];
                    let existingStyleExpr = existingStyleAttr.value;
                    if (t.isJSXExpressionContainer(existingStyleExpr)) {
                      existingStyleExpr = existingStyleExpr.expression;
                    }

                    let combinedArray;
                    if (t.isArrayExpression(existingStyleExpr)) {
                      combinedArray = t.arrayExpression([...existingStyleExpr.elements, twStyleCall]);
                    } else {
                      combinedArray = t.arrayExpression([existingStyleExpr, twStyleCall]);
                    }

                    attributes[styleAttrIndex].value = t.jsxExpressionContainer(combinedArray);
                    attributes.splice(classNameAttrIndex, 1);
                  } else {
                    classAttr.name.name = 'style';
                    classAttr.value = t.jsxExpressionContainer(twStyleCall);
                  }
                }
              }
            }
          }
        };
      }
    ],
  };
};
