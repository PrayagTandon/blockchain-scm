import React from "react"; 

import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Grid from "@mui/material/Grid";
import DialogActions from '@mui/material/DialogActions';

import "../css/PopUpModal.css";

/**
 * Renders product batch details.
 * 
 * @author syuki
 */
export default class ProductDetails extends React.Component {

    state = {
        currency: "₹",
        unit: "Kg"
    }

    render() {
        const productDetails = this.props.product;
        return(
            <Dialog
                open={this.props.open}
                aria-labelledby="scroll-dialog-title"
                aria-describedby="scroll-dialog-description"
                fullWidth
                onClose={this.props.closePopup}
                scroll="paper" 
                className="popup-modal"
                style={{ height: "1000px"}}>
                <center>
                    <DialogTitle id="scroll-dialog-title">Batch Details</DialogTitle>
                </center>
                <DialogContent dividers={true}>
                    <DialogContentText
                        id="scroll-dialog-description"
                        ref={null}
                        tabIndex={-1}
                        color="secondary"
                    >
                        <Grid container color="secondary" justify="flex-end" spacing={1}>
                            <Grid item xs={6} style={{ fontWeight: "bold"}}>
                                Product ID 
                            </Grid>
                            <Grid item xs>
                                {productDetails.productId} 
                            </Grid>
                            <Grid item xs={6} style={{ fontWeight: "bold"}}>
                                Product Name 
                            </Grid>
                            <Grid item xs>
                                {productDetails.productName} 
                            </Grid>
                            <Grid item xs={6} style={{ fontWeight: "bold"}} >
                                Product Description
                            </Grid>
                            <Grid item xs style={{whiteSpace: 'pre-line'}} >
                                    {productDetails.productDesc} 
                            </Grid>
                            <Grid item xs={6} style={{ fontWeight: "bold"}}>
                                Product Price
                            </Grid>
                            <Grid item xs>
                                {productDetails.productPrice} {this.state.currency}
                            </Grid>
                            <Grid item xs={6} style={{ fontWeight: "bold"}}>
                                Product Quantity
                            </Grid>
                            <Grid item xs>
                                {productDetails.productQuantity} {this.state.unit}
                            </Grid>
                            <Grid item xs={6} style={{ fontWeight: "bold"}}>
                                Product Status
                            </Grid>
                            <Grid item xs>
                                {productDetails.productStatus}
                            </Grid>
                        </Grid>
                    </DialogContentText>
                </DialogContent>
                <center>
                    <DialogActions>
                        <Grid 
                            container 
                            color="secondary"  
                            justifyContent="center">
                            <Grid item xs>
                                <Button 
                                    variant="contained" 
                                    className="nf-button" 
                                    color="primary" 
                                    onClick={this.props.closePopup}>Close</Button>
                            </Grid> 
                        </Grid>
                    </DialogActions>
                </center>
            </Dialog>
        )
    }
};