import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AboutUsScreen from '../screens/AboutUS/AboutUsScreen';
import ChangePasswordScreen from '../screens/Auth/ChangePasswordScreen';
import ForgotPasswordScreen from '../screens/Auth/ForgotPasswordScreen';
import LoginScreen from '../screens/Auth/LoginScreen';
import RegisterScreen from '../screens/Auth/RegisterScreen';
import BusinessDetailsScreen from '../screens/Businesses/BusinessDetailsScreen';
import BusinessScreen from '../screens/Businesses/BusinessScreen';
import CommitteeMemberScreen from '../screens/Directory/CommitteeMemberScreen';
import DirectoryScreen from '../screens/Directory/DirectoryScreen';
import EventDetailScreen from '../screens/Events/EventDetailScreen';
import EventsScreen from '../screens/Events/EventsScreen';
import NewsDetailScreen from '../screens/News/NewsDetailScreen';
import FailPaymentScreen from '../screens/Payment/FailPaymentScreen';
import RegisterPaymentScreen from '../screens/Payment/RegisterPaymentScreen';
import SuccessPaymentScreen from '../screens/Payment/SuccessPaymentScreen';
import HelpAndSupportScreen from '../screens/Settings/HelpAndSupportScreen';
import SettingsScreen from '../screens/Settings/SettingsScreen';
import BottomTabNavigator from './BottomTabNavigator';
import UserDetailsScreen from '../screens/Directory/UserDetailsScreen';
import ViewFamilyList from '../screens/Settings/ViewFamilyList';
import AddFamilyMember from '../screens/Settings/AddFamilyMember';
import OwnBussiness from '../screens/Settings/OwnBussiness';
import BussinesRequest from '../screens/Settings/BussinesRequest';
import Onboarding from '../screens/Onboarding/Onboarding';
import EditFamilyMember from '../screens/Settings/EditFamilyMember';
import TermsAndConditions from '../screens/Terms/TermAndCondition';
import NotificationsScreen from '../screens/Notification/NotificationsScreen';
import EditProfile from '../screens/Profile/EditProfileScreen';
import AddEvent from '../screens/Events/AddEvent';
import MyEvents from '../screens/Events/MyEvents';

const Stack = createNativeStackNavigator();

const StackNavigator = () => {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="MainTabs" component={BottomTabNavigator} />
            <Stack.Screen
                name="Login"
                component={LoginScreen}
                options={{ headerShown: false, title: 'Login' }}
            />
            <Stack.Screen
                name="RegisterUser"
                component={RegisterScreen}
                options={{ headerShown: false, title: 'RegisterUser' }}
            />
            <Stack.Screen
                name="AboutUs"
                component={AboutUsScreen}
                options={{ headerShown: false, title: 'AboutUs' }}
            />
            <Stack.Screen
                name="DirectoryScreen"
                component={DirectoryScreen}
                options={{ headerShown: false, title: 'DirectoryScreen' }}
            />
            <Stack.Screen
                name="UserDetailsPage"
                component={UserDetailsScreen}
                options={{ headerShown: false, title: 'UserDetailsPage' }}
            />
            <Stack.Screen
                name="CommitteeMembers"
                component={CommitteeMemberScreen}
                options={{ headerShown: false, title: 'CommitteeMembers' }}
            />
            <Stack.Screen
                name="NewsDetails"
                component={NewsDetailScreen}
                options={{ headerShown: false, title: 'NewsDetails' }}
            />
            <Stack.Screen
                name="EventScreen"
                component={EventsScreen}
                options={{ headerShown: false, title: 'EventScreen' }}
            />
            <Stack.Screen
                name="EventDetailsScreen"
                component={EventDetailScreen}
                options={{ headerShown: false, title: 'EventDetailsScreen' }}
            />
            <Stack.Screen
                name="BusinessScreen"
                component={BusinessScreen}
                options={{ headerShown: false, title: 'BusinessScreen' }}
            />
            <Stack.Screen
                name="BusinessDetailsScreen"
                component={BusinessDetailsScreen}
                options={{ headerShown: false, title: 'BusinessDetailsScreen' }}
            />
            <Stack.Screen
                name="HelpAndSupportScreen"
                component={HelpAndSupportScreen}
                options={{ headerShown: false, title: 'HelpAndSupportScreen' }}
            />
            <Stack.Screen
                name="settings"
                component={SettingsScreen}
                options={{ headerShown: false, title: 'settings' }}
            />
            <Stack.Screen
                name="ChangePassword"
                component={ChangePasswordScreen}
                options={{ headerShown: false, title: 'ChangePassword' }}
            />
            <Stack.Screen
                name="ForgotPassword"
                component={ForgotPasswordScreen}
                options={{ headerShown: false, title: 'ForgotPassword' }}
            />
            <Stack.Screen
                name="RegisterPayment"
                component={RegisterPaymentScreen}
                options={{ headerShown: false, title: 'RegisterPayment' }}
            />
            <Stack.Screen
                name="SuccessPayment"
                component={SuccessPaymentScreen}
                options={{ headerShown: false, title: 'SuccessPayment' }}
            />
            <Stack.Screen
                name="FailPayment"
                component={FailPaymentScreen}
                options={{ headerShown: false, title: 'FailPayment' }}
            />
            <Stack.Screen
                name="ViewFamilyList"
                component={ViewFamilyList}
                options={{ headerShown: false, title: 'ViewFamilyList' }}
            />
            <Stack.Screen
                name="AddFamilyMember"
                component={AddFamilyMember}
                options={{ headerShown: false, title: 'AddFamilyMember' }}
            />
            <Stack.Screen
                name="OwnBussiness"
                component={OwnBussiness}
                options={{ headerShown: false, title: 'OwnBussiness' }}
            />
            <Stack.Screen
                name="BussinesRequest"
                component={BussinesRequest}
                options={{ headerShown: false, title: 'BussinesRequest' }}
            />
            <Stack.Screen
                name="Onboarding"
                component={Onboarding}
                options={{ headerShown: false, title: 'Onboarding' }}
            />
            <Stack.Screen
                name="EditFamilyMember"
                component={EditFamilyMember}
                options={{ headerShown: false, title: 'EditFamilyMember' }}
            />
            <Stack.Screen
                name="TermsAndConditions"
                component={TermsAndConditions}
                options={{ headerShown: false, title: 'TermsAndConditions' }}
            />
            <Stack.Screen
                name="NotificationsScreen"
                component={NotificationsScreen}
                options={{ headerShown: false, title: 'NotificationsScreen' }}
            />
            <Stack.Screen
                name="EditProfile"
                component={EditProfile}
                options={{ headerShown: false, title: 'EditProfile' }}
            />
            <Stack.Screen
                name="AddEvent"
                component={AddEvent}
                options={{ headerShown: false, title: 'AddEvent' }}
            />
            <Stack.Screen
                name="MyEvents"
                component={MyEvents}
                options={{ headerShown: false, title: 'MyEvents' }}
            />
        </Stack.Navigator>
    );
};

export default StackNavigator;
