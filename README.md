# jssel
A utitily javascript library for traversing and selecting multiple DOM elements in a single statement.
It uses a terse syntax, which allows for writing multiple selectors with very little code.

Example:
Given the markup
```
<article>
  <div>
    <div id="start">
      <h4>
        Header
      </h4>
    </div>
  </div>
  <div>
    <span>Span 1</span>
    <span>Span 2</span>
    <span>Span 3</span>
  </div>
</article>
```
and assuming you want to select `<article>`, `<h4> -> text` and all `<span>` elments, you could do the following:

`const elmts = jsSel.select(e, '^article h4;val ^[1];>[1];[span]')`

The result will be the array:
```
[ article, "Header", NodeList(3) /* contains <span> elmts*/ ]
```
