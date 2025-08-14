// pages/index.js
import { Card, CardContent, Button, Grid } from '@mui/material';
import Link from 'next/link';

const Home = () => {
    return (
        <Grid container spacing={2} justifyContent="center" style={{ marginTop: '20px' }}>
            <Grid item>
                <Card>
                    <CardContent>
                        <h2>Scenario 1: Shopping Cart</h2>
                        <Link href="/checkout" passHref>
                            <Button color="primary" variant="contained">
                                Go to Checkout
                            </Button>
                        </Link>
                    </CardContent>
                </Card>
            </Grid>
        </Grid>
    );
};

export default Home;
