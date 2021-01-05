import React, { FC } from 'react'
import preloader from '../../../assets/loaders/loader_01.gif';

const Preloader: FC = () => (
		<div className='preloader'>
			<img alt='' src={preloader} />
		</div>
)

export default Preloader
