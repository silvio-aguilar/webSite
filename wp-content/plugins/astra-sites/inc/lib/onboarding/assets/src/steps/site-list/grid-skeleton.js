import React from 'react';
import Skeleton from '@mui/lab/Skeleton';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';

const GridSkeleton = () => {
	return (
		<div className="st-grid-skeleton">
			<Grid container>
				<Grid item xs={ 12 }>
					<Box
						p="0"
						display="grid"
						gap="40px"
						gridTemplateColumns="1fr 1fr 1fr 1fr"
					>
						<Skeleton
							variant="rect"
							height={ 380 }
							animation="wave"
						/>
						<Skeleton
							variant="rect"
							height={ 380 }
							animation="wave"
						/>
						<Skeleton
							variant="rect"
							height={ 380 }
							animation="wave"
						/>
						<Skeleton
							variant="rect"
							height={ 380 }
							animation="wave"
						/>
					</Box>
				</Grid>
			</Grid>
		</div>
	);
};

export default GridSkeleton;
