import { Box } from "@mui/material";

const Logo = () => (
    <Box width="100%" justifyContent="center" display="flex" mt={3}>
        <picture>
            <source
                srcSet="/images/calendrier-avant-le-matin-dimanche.png"
                type="image/webp"
            />
            <img
                src="/images/calendrier-avant-le-matin-dimanche.png"
                alt="calendrier de l'avant le matin dimanche"
                width={200}
            />
        </picture>
    </Box>
);
export default Logo;
