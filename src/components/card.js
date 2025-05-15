import * as React from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

export default function ImgMediaCard({ key, title, image, alt, price }) {
    return (
        <Card
            sx={{
                maxWidth: 200,
                minHeight: 360,
                maxHeight: 360,
                cursor: 'pointer',
                borderRadius: 4, 
                backgroundColor: '#f5f5f5', 
            }}
        >
            <CardMedia
                component="img"
                alt={alt}
                image={image}
                height={250}
                sx={{ borderRadius: 4 }} 
            />
            <CardContent>
                <Typography gutterBottom variant="h5" component="div" sx={{ fontSize: 16 }}>
                    {title}
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: 14, fontWeight: 'bold', color: '#000' }}>
                    R$ {price} no Pix
                </Typography>
            </CardContent>
        </Card>
    );
}
