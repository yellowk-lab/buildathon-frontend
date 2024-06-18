import { Box, Typography, Link } from "@mui/material";

export default function Footer() {
    return (
        <Box py={16} pt={10} px={4} bgcolor="#313B75" textAlign="center">
            <Typography color="white">
                Pour toute assistance ou demande de renseignements, veuillez{" "}
                <Link textAlign="center" href="mailto:support@caissette.ch">
                    nous contacter.
                </Link>{" "}
            </Typography>
        </Box>
    );
}
