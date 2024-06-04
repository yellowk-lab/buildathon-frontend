import {
    InputAdornment,
    Tab,
    Tabs,
    TextField,
    Box,
    Grid,
    Chip,
    Skeleton,
} from "@mui/material";
import { GridToolbarContainer } from "@mui/x-data-grid";
import SearchIcon from "@mui/icons-material/Search";
import { useState } from "react";

interface TabConfig {
    value: any;
    label: string;
    amount?: number;
}

interface Props {
    loading: boolean;
    tabConfig: TabConfig[];
    showSearchBar: boolean;
    onChange: (value: any) => void;
    onSearch?: (value: string) => void;
    defaultTab?: any
}

const GridToolbar: React.FC<Props> = ({
    loading,
    tabConfig,
    showSearchBar,
    onChange,
    onSearch,
    defaultTab
}) => {
    const [tab, setTab] = useState<any | undefined>(defaultTab);

    const handleChange = (newValue: any) => {
        onChange(newValue);
        setTab(newValue);
    };

    const handleSearch = (evt: React.ChangeEvent<HTMLInputElement>) => {
        onSearch && onSearch(evt.target.value);
    };

    if (loading) {
        return (
            <GridToolbarContainer>
                <Box m={1} width="100%">
                    <Skeleton height={50} width="100%" />
                </Box>
            </GridToolbarContainer>
        );
    }

    return (
        <GridToolbarContainer>
            <Grid container display="flex" justifyContent="space-between">
                <Grid item>
                    <Tabs value={tab} aria-label="list" textColor="inherit">
                        {tabConfig.map((config) => (
                            <TabWithChip
                                key={config.value}
                                value={config.value}
                                label={config.label}
                                amount={config.amount}
                                onClick={handleChange}
                            />
                        ))}
                    </Tabs>
                </Grid>
                {showSearchBar && (
                    <Grid item>
                        <TextField
                            placeholder="+41 78 788 78 78"
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <SearchIcon />
                                    </InputAdornment>
                                ),
                            }}
                            onChange={handleSearch}
                        />
                    </Grid>
                )}
            </Grid>
        </GridToolbarContainer>
    );
};

interface TabsProps {
    label: string;
    value: any;
    onClick: (value: any) => void;
    amount?: number;
}

const TabWithChip: React.FC<TabsProps> = ({
    label,
    value,
    onClick,
    amount = 0,
}) => (
    <Tab
        value={value}
        label={label}
        iconPosition="end"
        icon={amount > 0 ? <Chip label={amount} /> : undefined}
        onClick={() => onClick(value)}
    />
);

export default GridToolbar;
