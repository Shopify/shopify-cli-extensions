# frozen_string_literal: true

require 'minitest/autorun'
require 'json'

module IntegrationTest
  class TestPackageJson < Minitest::Test
    def test_package_json_exists
      assert File.exist?('tmp/integration_test/package.json')
    end

    def test_package_json_contents
      package_json_contents = File.read('tmp/integration_test/package.json')
      package_json = JSON.parse(package_json_contents)
      dependencies = package_json['dependencies']
      devDependencies = package_json['devDependencies']
      scripts = package_json['scripts']

      assert_equal('integration_test', package_json['name'])
      assert_equal('MIT', package_json['license'])
      assert_equal('~> 0.14.0', dependencies['@shopify/checkout-ui-extensions-react'])
      assert_equal('^17.0.0', dependencies['react'])
      assert_equal('^15.5.1', dependencies['graphql'])
      assert_equal('^2.12.4', dependencies['graphql-tag'])
      assert_equal('^3.4.8', dependencies['@apollo/client'])
      assert_equal('^4.1.0', devDependencies['typescript'])
      assert_equal('latest', devDependencies['@shopify/shopify-cli-extensions'])
      assert_equal('shopify-cli-extensions build', scripts['build'])
      assert_equal('shopify-cli-extensions develop', scripts['develop'])
    end
  end
end
