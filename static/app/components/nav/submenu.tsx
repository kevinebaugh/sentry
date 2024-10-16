import {Fragment} from 'react';
import styled from '@emotion/styled';
import {motion} from 'framer-motion';

import Feature from 'sentry/components/acl/feature';
import Link from 'sentry/components/links/link';
import {useNavContext} from 'sentry/components/nav/context';
import {useNavIndicator} from 'sentry/components/nav/useNavIndicator';
import type {NavSubmenuItem} from 'sentry/components/nav/utils';
import {
  isNavItemActive,
  isNonEmptyArray,
  makeLinkPropsFromTo,
} from 'sentry/components/nav/utils';
import {space} from 'sentry/styles/space';
import {useLocation} from 'sentry/utils/useLocation';

function Submenu() {
  const nav = useNavContext();
  if (!nav.submenu) {
    return null;
  }

  return (
    <SubmenuWrapper role="navigation" aria-label="Secondary Navigation">
      <SubmenuBody>
        {nav.submenu.main.map(item => (
          <SubmenuItem key={item.label} item={item} />
        ))}
      </SubmenuBody>
      {isNonEmptyArray(nav.submenu.footer) && (
        <SubmenuFooter>
          {nav.submenu.footer.map(item => (
            <SubmenuItem key={item.label} item={item} />
          ))}
        </SubmenuFooter>
      )}
    </SubmenuWrapper>
  );
}

export default Submenu;

const SubmenuWrapper = styled(motion.div)`
  position: relative;
  border-right: 1px solid ${p => p.theme.translucentGray200};
  background: ${p => p.theme.surface300};
  display: flex;
  align-items: stretch;
  justify-content: space-between;
  flex-direction: column;
  width: 150px;
  z-index: ${p => p.theme.zIndex.sidebarPanel};
`;

function SubmenuItem({item}: {item: NavSubmenuItem}) {
  const location = useLocation();
  const isActive = isNavItemActive(item, location);
  const linkProps = makeLinkPropsFromTo(item.to);

  const FeatureGuard = item.feature ? Feature : Fragment;
  const featureGuardProps: any = item.feature ?? {};

  return (
    <FeatureGuard {...featureGuardProps}>
      <SubmenuItemWrapper>
        <Link
          {...linkProps}
          className={isActive ? 'active' : undefined}
          aria-current={isActive ? 'page' : undefined}
        >
          {item.label}
        </Link>
      </SubmenuItemWrapper>
    </FeatureGuard>
  );
}

const SubmenuItemList = styled('ul')`
  list-style: none;
  margin: 0;
  padding: 0;
  padding-top: ${space(1)};
  display: flex;
  flex-direction: column;
  width: 100%;
  color: ${p => p.theme.gray400};
`;

const SubmenuItemWrapper = styled('li')`
  a {
    display: flex;
    padding: 5px ${space(1.5)};
    height: 32px;
    align-items: center;
    color: inherit;
    font-size: ${p => p.theme.fontSizeMedium};
    font-weight: ${p => p.theme.fontWeightNormal};
    line-height: 177.75%;
    margin-inline: ${space(1)};
    border: 1px solid transparent;
    border-radius: ${p => p.theme.borderRadius};

    &:hover {
      color: ${p => p.theme.gray500};
      /* background: rgba(62, 52, 70, 0.09); */
    }

    &.active {
      color: ${p => p.theme.gray500};
      background: rgba(62, 52, 70, 0.09);
      border: 1px solid ${p => p.theme.translucentGray100};
    }
  }
`;

const SubmenuIndicator = styled(motion.span)`
  position: absolute;
  left: 0;
  right: 0;
  opacity: 0;
  pointer-events: none;
  margin-inline: ${space(1)};
  height: 32px;
  background: ${p => p.theme.translucentGray100};
  border-radius: ${p => p.theme.borderRadius};
`;

const SubmenuFooterWrapper = styled('div')`
  position: relative;
  border-top: 1px solid ${p => p.theme.translucentGray200};
  background: ${p => p.theme.surface300};
  display: flex;
  flex-direction: row;
  align-items: stretch;
  padding-block: ${space(1)};
`;

function SubmenuBody({children}) {
  const {indicatorProps, containerProps} = useNavIndicator();
  return (
    <div>
      <SubmenuIndicator {...indicatorProps} />
      <SubmenuItemList {...containerProps}>{children}</SubmenuItemList>
    </div>
  );
}

function SubmenuFooter({children}) {
  const {indicatorProps, containerProps} = useNavIndicator();
  return (
    <SubmenuFooterWrapper>
      <SubmenuIndicator {...indicatorProps} />
      <SubmenuItemList {...containerProps}>{children}</SubmenuItemList>
    </SubmenuFooterWrapper>
  );
}
