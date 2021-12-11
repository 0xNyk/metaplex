import React from "react";
import { Link } from "react-router-dom";

import {
  Box,
  Button,
  Chip,
  Link as HyperLink,
  ImageList,
  ImageListItem,
  ImageListItemBar,
  Stack,
} from "@mui/material";

import {
  Connection as RPCConnection,
  PublicKey,
} from "@solana/web3.js";

import {
  useConnectionConfig,
  shortenAddress,
} from '@oyster/common';

import {
  CachedImageContent,
} from '../components/ArtContent';
import { Recipe } from './fireballView';
import useWindowDimensions from '../utils/layout';
import {
  envFor,
} from '../utils/transactions';

export type RecipeLink = {
  image: string,
  name: string,
  mint?: PublicKey,
  link?: string,
};


export const ExploreView = (
  props: {
    recipeYields: Array<RecipeLink>,
  },
) => {
  const { endpoint } = useConnectionConfig();
  const connection = React.useMemo(
    () => new RPCConnection(endpoint.url, 'recent'),
    [endpoint]
  );

  const explorerLinkForAddress = (key : PublicKey, shorten: boolean = true) => {
    return (
      <HyperLink
        href={`https://explorer.solana.com/address/${key.toBase58()}?cluster=${envFor(connection)}`}
        target="_blank"
        rel="noreferrer"
        title={key.toBase58()}
        underline="none"
        sx={{
          fontFamily: 'Monospace',
        }}
      >
        {shorten ? shortenAddress(key.toBase58()) : key.toBase58()}
      </HyperLink>
    );
  };

  // TODO: more robust
  const maxWidth = 960;
  const outerPadding = 96 * 2;
  const columnsGap = 40;
  const maxColumns = 3;
  const columnWidth = (maxWidth - columnsGap * (maxColumns - 1)) / maxColumns;

  const tilePadding = 0;
  const imageWidth = columnWidth - tilePadding * 2;

  const { width } = useWindowDimensions();
  const sizedColumns = (width : number) => {
           if (width > columnWidth * 3 + columnsGap * 2 + outerPadding) {
      return 3;
    } else if (width > columnWidth * 2 + columnsGap * 1 + outerPadding) {
      return 2;
    } else {
      return 1;
    }
  };
  const cols = sizedColumns(width);
  return (
    <Stack
      spacing={1}
      style={{
        ...(width >= maxWidth + outerPadding ? { width: maxWidth } : {}),
        marginLeft: 'auto',
        marginRight: 'auto',
      }}
    >
      <p className={"text-title"}>
        Explore Recipes
      </p>
      <p className={"text-subtitle"}>
        Recipes let you mix and match your current NFTs to craft new, rarer items.
      </p>
      <ImageList cols={cols} gap={columnsGap}>
        {props.recipeYields.map((r, idx) => {
          const yieldImage = (style) => (
            <CachedImageContent
              uri={r.image}
              preview={false}
              className={"fullAspectRatio"}
              style={{
                ...style,
              }}
            />
          );
          return (
            <div
              key={idx}
              style={{
                minWidth: columnWidth,
              }}
            >
              <ImageListItem>
                {r.link
                  ? (
                    <Link
                      to={r.link}
                      style={{
                        color: 'inherit',
                        display: 'block',
                      }}
                    >
                      {yieldImage({})}
                    </Link>
                  )
                  : (
                    <div>
                      {yieldImage({ filter: 'grayscale(100%)' })}
                    </div>
                  )
                }
                <ImageListItemBar
                  title={r.name}
                  subtitle={(
                    <div
                      style={{
                        paddingBottom: '10px',
                      }}
                    >
                      {r.mint
                        ? explorerLinkForAddress(r.mint)
                        : (
                          <p
                            style={{
                              fontSize: '12px',
                              fontFamily: 'Monospace',
                              color: '#b480eb',
                            }}
                          >
                            Coming Soon
                          </p>
                        )
                      }
                    </div>
                  )}
                  position="below"
                />
              </ImageListItem>
            </div>
          );
        })}
      </ImageList>
    </Stack>
  );
}

