const Header = (props) => {
	return(
		<header className="masthead mb-auto">
	        <div className="inner">
	          <h3 className="masthead-brand">21 Game</h3>
	          <nav className="nav nav-masthead justify-content-center">
	          	    {props.address ?
          				<p>{props.address} </p>
          				:
          				<button type="button" className="btn btn-secondary" onClick={props.handleConnectWallet}>Connect Wallet</button>
        			}
	          </nav>
	        </div>
      	</header>
	);
}

export default Header;

