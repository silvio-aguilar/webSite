<?php
/**
 * The base configuration for WordPress
 *
 * The wp-config.php creation script uses this file during the installation.
 * You don't have to use the website, you can copy this file to "wp-config.php"
 * and fill in the values.
 *
 * This file contains the following configurations:
 *
 * * Database settings
 * * Secret keys
 * * Database table prefix
 * * ABSPATH
 *
 * @link https://wordpress.org/documentation/article/editing-wp-config-php/
 *
 * @package WordPress
 */

// ** Database settings - You can get this info from your web host ** //
/** The name of the database for WordPress */
define( 'DB_NAME', 'webSite_db' );

/** Database username */
define( 'DB_USER', 'root' );

/** Database password */
define( 'DB_PASSWORD', '' );

/** Database hostname */
define( 'DB_HOST', 'localhost' );

/** Database charset to use in creating database tables. */
define( 'DB_CHARSET', 'utf8mb4' );

/** The database collate type. Don't change this if in doubt. */
define( 'DB_COLLATE', '' );

/**#@+
 * Authentication unique keys and salts.
 *
 * Change these to different unique phrases! You can generate these using
 * the {@link https://api.wordpress.org/secret-key/1.1/salt/ WordPress.org secret-key service}.
 *
 * You can change these at any point in time to invalidate all existing cookies.
 * This will force all users to have to log in again.
 *
 * @since 2.6.0
 */
define( 'AUTH_KEY',         '#83E,QN--a`2tFP+ x<UG ;G?chmEs:{a>%bd![<I6r{>)se3p,$MAb;*np.9H;<' );
define( 'SECURE_AUTH_KEY',  'EoU5+}Q.Dej`<n$w*3J-/uk7o0yNbj|>]DgzutA$|Lw<yvg%a565}:LaH2Z,6:F(' );
define( 'LOGGED_IN_KEY',    '3mh/DnVm`]5]s<>?azY65_s<4N6 JrjDQ,L$?w-g+*D&SUVzt%n |nq8;;aeqW55' );
define( 'NONCE_KEY',        'e!#xd]v8)_39Z{IdwNd5AinNR0.V#Wc+<c{%>/5l-,lW8Mb`;-YJ8vFc$m69iT[q' );
define( 'AUTH_SALT',        'd1jbOS9v]20:*c/;&IuDv;GzeJ*n$d=d%g`lr 5jpt}vwrBu;,gq>zzsEgm),L~7' );
define( 'SECURE_AUTH_SALT', 'GtOL?eKhdCAiA:eS8=#`S77xk+O!k[g[Vqt.(D64%esK?7&M)MwhHuI}GAjvk 8z' );
define( 'LOGGED_IN_SALT',   'lYl8VEd7AWxO]}oIs5SY%^5g.<!))/mP7nH<iacu#;_tmwYcB(4xMa,ZNGbR*>8D' );
define( 'NONCE_SALT',       'Ex/j ]T}92V78s5n`c-ze`D.|Yw!`51_hiK->`L#HR)?{&#-U_qK6M=wAu;pyGM_' );

/**#@-*/

/**
 * WordPress database table prefix.
 *
 * You can have multiple installations in one database if you give each
 * a unique prefix. Only numbers, letters, and underscores please!
 */
$table_prefix = 'wp_';

/**
 * For developers: WordPress debugging mode.
 *
 * Change this to true to enable the display of notices during development.
 * It is strongly recommended that plugin and theme developers use WP_DEBUG
 * in their development environments.
 *
 * For information on other constants that can be used for debugging,
 * visit the documentation.
 *
 * @link https://wordpress.org/documentation/article/debugging-in-wordpress/
 */
define( 'WP_DEBUG', false );

/* Add any custom values between this line and the "stop editing" line. */



/* That's all, stop editing! Happy publishing. */

/** Absolute path to the WordPress directory. */
if ( ! defined( 'ABSPATH' ) ) {
	define( 'ABSPATH', __DIR__ . '/' );
}

/** Sets up WordPress vars and included files. */
require_once ABSPATH . 'wp-settings.php';
