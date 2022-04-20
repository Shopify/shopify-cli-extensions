# frozen_string_literal: true

require 'minitest/autorun'
require 'json'
require 'yaml'
require 'pry-byebug'

module IntegrationTest
  class TestMergeConfig < Minitest::Test
    def test_package_json_exists
      assert File.exist?('tmp/integration_test/package.json')
    end

    def test_package_json_contents
      package_json_contents = File.read('tmp/integration_test/package.json')
      package_json = JSON.parse(package_json_contents)
      dependencies = package_json['dependencies']
      dev_dependencies = package_json['devDependencies']
      scripts = package_json['scripts']

      assert_equal('integration_test', package_json['name'])
      assert_equal('MIT', package_json['license'])
      assert_equal('~> 0.14.0', dependencies['@shopify/checkout-ui-extensions-react'])
      assert_equal('^17.0.0', dependencies['react'])
      assert_equal('^15.5.1', dependencies['graphql'])
      assert_equal('^2.12.4', dependencies['graphql-tag'])
      assert_equal('^3.4.8', dependencies['@apollo/client'])
      assert_equal('^4.1.0', dev_dependencies['typescript'])
      assert_equal('latest', dev_dependencies['@shopify/shopify-cli-extensions'])
      assert_equal('shopify-cli-extensions build', scripts['build'])
      assert_equal('shopify-cli-extensions develop', scripts['develop'])
    end

    def test_node_modules_directory
      assert File.directory?('tmp/integration_test/node_modules')
      refute Dir.empty?('tmp/integration_test/node_modules')
    end

    def test_extension_config_yml_contents
      extension_config_yml = YAML.load_file('tmp/integration_test/extension.config.yml')
      extension_points = extension_config_yml['extension_points']
      metafields = extension_config_yml['metafields']
      development = extension_config_yml['development']
      development_build_env = development['build']['env']
      development_develop_env = development['develop']['env']

      assert_equal(['Playground'], extension_config_yml['extension_points'])
      assert_equal('my-namespace', metafields[0]['namespace'])
      assert_equal('my-key', metafields[0]['key'])
      assert_equal('bar', development_build_env['CUSTOM_VAR'])
      assert_equal('foo', development_develop_env['CUSTOM_VAR'])
    end

    def test_dot_shopify_cli_yml_contents
      extension_config_yml = YAML.load_file('tmp/integration_test/.shopify-cli.yml')

      assert_equal('INTEGRATION_TEST', extension_config_yml['EXTENSION_TYPE'])
      assert_equal(0, extension_config_yml['organization_id'])
      assert_equal(:extension, extension_config_yml['project_type'])
    end
  end
end
