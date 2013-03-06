var assert = require('assert');
var lib = require('../lib/main');
var $ = lib.auQuery; 
var Browser = lib.browser; 

var calls = []; 

var testPage1 = function(){
	this.propertyOne = {
		click: function(){
			calls.push( {method:'property1.click', args:[]});
			return testPage2; 
		},
		type: function(){
			calls.push( {method:'property1.type', args:[]});
		}
	};
	
	this.propertyTwo = function(){
		var prop2 = {
			click: function(){
				calls.push( {method:'property2.click', args:[]});
				return testPage2; 
			},
			type: function(){
				calls.push( {method:'property2.type', args:[]});
			}
		};
		return prop2; 
	};
	this.functionOne = function(){
		calls.push( {method:'functionOne', args:[]});
	};
	this.name = 'testPage1'; 
};
testPage1.to = function(){
	calls.push({method:'to', args:[]});
};

var testPage2 = function(){
	this.name = 'testPage2'; 
};

var cb = function(err, result){
	calls.push({method:'cb', args:{err:err, result:result}});
};
var browser = new Browser({}); 

describe('browser', function(){
	beforeEach(function(){
		calls = [];
	}),
	describe('#to()', function(){
		it('should go to page', function( done){
			browser.drive(function($){
				this.to(testPage1); 
				assert.equal(this.page().name, 'testPage1'); 
				assert.equal(this.name, 'testPage1');
				assert.equal(calls[0].method,'to'); 
				assert.equal(calls[0].args.length,0); 
			},done);
		}),
		it('should allow to access the page functions', function( done){
			browser.drive(function($){
				this.to(testPage1); 
				this.functionOne();
				assert.equal(calls[0].method,'to'); 
				assert.equal(calls[0].args.length,0); 
				assert.equal(calls[1].method,'functionOne'); 
				assert.equal(calls[1].args.length,0); 
			},done);
		})
	}),
	describe('#click()', function(){
		it('should go to the next page', function(done){
			browser.drive(function($){
				this.to(testPage1); 
				this.click(this.propertyOne);
				assert.equal(this.name, 'testPage2');  
			},done);
		}),
		it('should resolve clicks through its name', function(done){
			browser.drive(function($){
				this.to(testPage1); 
				this.click('propertyOne');
				assert.equal(this.name, 'testPage2');  
			}, done);
		}),
		it('should resolve clicks through generating functions', function(done){
			browser.drive(function($){
				this.to(testPage1); 
				this.click('propertyTwo');
				assert.equal(this.name, 'testPage2');  
			}, done);
		})
	})
})
