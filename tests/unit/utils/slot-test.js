import Slot from 'ember-sortable/utils/slot';
import { module, test } from 'qunit';

class FakeNode {
  constructor(element) {
    this.elementId = 'fake-node';
    this.element = element;
    this.sortableChildren = [];
  }

  $() {
    return $(this.element);
  }
}

module('Unit | Utility | Slot', {
  beforeEach() {
    this.element = document.createElement('div');
    this.node = new FakeNode(this.element);

    this.element.style.position = 'absolute';
    this.element.style.left = '10px';
    this.element.style.top = '20px';
    this.element.style.width = '100px';
    this.element.style.height = '200px';
    this.element.style.padding = '10px 5px';

    document.body.appendChild(this.element);

    this.slot = new Slot(this.node);
  },

  afterEach() {
    this.element.remove();
  }
});

test('construct', function(assert) {
  let { slot } = this;

  assert.equal(slot.id, 'fake-node');
  assert.equal(slot.x, 10);
  assert.equal(slot.y, 20);
  assert.equal(slot.width, 100);
  assert.equal(slot.outerWidth, 110);
  assert.equal(slot.height, 200);
  assert.equal(slot.outerHeight, 220);
  assert.deepEqual(slot.bounds, { top: 20, left: 10, bottom: 240, right: 120 });
});

test('translateBy', function(assert) {
  let { slot } = this;

  slot.translateBy(10, 10);

  assert.equal(slot.x, 20);
  assert.equal(slot.y, 30);
  assert.deepEqual(slot.bounds, { top: 30, left: 20, bottom: 250, right: 130 });
});

test('resizeBy', function(assert) {
  let { slot } = this;

  slot.resizeBy(10, 10);

  assert.equal(slot.width, 110);
  assert.equal(slot.outerWidth, 120);
  assert.equal(slot.height, 210);
  assert.equal(slot.outerHeight, 230);
  assert.deepEqual(slot.bounds, { top: 20, left: 10, bottom: 250, right: 130 });
});

test('render', function(assert) {
  let { slot, element } = this;

  slot.translateBy(10, 10);
  slot.resizeBy(10, 10);
  slot.render();

  let { width, height, transform } = element.style;

  assert.equal(width, '110px');
  assert.equal(height, '210px');
  assert.equal(transform, 'translate(10px, 10px)');
});

test('clear', function(assert) {
  let { slot, element } = this;

  slot.render();
  slot.clear();

  let { width, height, transform } = element.style;

  assert.equal(width, '');
  assert.equal(height, '');
  assert.equal(transform, '');
});

test('covers', function(assert) {
  let { slot } = this;

  assert.equal(slot.covers({ x: 9,   y: 20  }), false);
  assert.equal(slot.covers({ x: 10,  y: 19  }), false);
  assert.equal(slot.covers({ x: 10,  y: 20  }), true);
  assert.equal(slot.covers({ x: 120, y: 240 }), true);
  assert.equal(slot.covers({ x: 121, y: 240 }), false);
  assert.equal(slot.covers({ x: 120, y: 241 }), false);
});

test('canReceiveNode (undefined)', function(assert) {
  let { slot } = this;
  let other = {};

  assert.equal(slot.canReceiveNode(other), true);
});

test('canReceiveNode (property)', function(assert) {
  let { slot, node } = this;
  let other = {};

  node.canReceiveSortable = false;

  assert.equal(slot.canReceiveNode(other), false);
});

test('canReceiveNode (method)', function(assert) {
  let { slot, node } = this;
  let other = {};

  node.canReceiveSortable = () => false;

  assert.equal(slot.canReceiveNode(other), false);
});

test('set x', function(assert) {
  let { slot } = this;

  slot.x = 20;

  assert.equal(slot.x, 20);
  assert.equal(slot.dx, 10);
});

test('set y', function(assert) {
  let { slot } = this;

  slot.y = 30;

  assert.equal(slot.y, 30);
  assert.equal(slot.dy, 10);
});

test('set width', function(assert) {
  let { slot } = this;

  slot.width = 200;

  assert.equal(slot.width, 200);
  assert.equal(slot.dw, 100);
});

test('set height', function(assert) {
  let { slot } = this;

  slot.height = 300;

  assert.equal(slot.height, 300);
  assert.equal(slot.dh, 100);
});
