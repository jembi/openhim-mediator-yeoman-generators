# Puppet manifest
#
# Required modules:
# willdurand/nodejs
#

# defaults for Exec
Exec {
  path => ["/bin", "/sbin", "/usr/bin", "/usr/sbin", "/usr/local/bin", "/usr/local/sbin", "/usr/local/node/node-default/bin/"],
  user => "root",
}

# Install required packages
Package { ensure => "installed" }
package { "git": }
package { "libfontconfig1": }

class { "nodejs":
  version => "stable",
  make_install => false,
}

exec { "npm-install":
  cwd => "/openhim-mediator-yeoman-generators",
  command => "npm install -g yo",
  require => Class["nodejs"],
}

exec { "yeoman-install":
  cwd => "/openhim-mediator-yeoman-generators",
  command => "npm install -g generator-generator",
  require => Exec["yeoman-install"],
}
