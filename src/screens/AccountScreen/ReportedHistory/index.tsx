import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Modal,
  ActivityIndicator,
  Alert,
} from "react-native";
import { AntDesign, Feather } from "@expo/vector-icons";
import { useDispatch, useSelector } from "react-redux";
import Header from "../../../components/Header";
import Icon from "react-native-vector-icons/Ionicons";
import { AppDispatch, RootState } from "../../../redux/store";
import {
  CriticalReportResponse,
  SearchCriticalReportRequest,
} from "../../../common/models/criticalReport";
import {
  getCriticalReportDetailThunk,
  searchCriticalReportThunk,
} from "../../../redux/thunk/criticalReportThunk";
import { StatusCriticalReport } from "../../../common/enums/StatusCriticalReport";
import { TypeCriticalReport } from "../../../common/enums/TypeCriticalReport";
import { RootStackParamList } from "../../../navigation/AppNavigator";
import { useNavigation, NavigationProp } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";

const formatMonthYear = (date: Date): string => {
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  return `${monthNames[date.getMonth()]} ${date.getFullYear()}`;
};

const formatCriticalReportDateTime = (creationDate: string): string => {
  const dt = new Date(creationDate);

  const day = dt.getDate().toString().padStart(2, "0");
  const month = (dt.getMonth() + 1).toString().padStart(2, "0");
  const year = dt.getFullYear();
  const formattedDate = `${day}-${month}-${year}`;

  const formattedTime = dt.toLocaleTimeString("en-US", {
    hour12: false,
    hour: "2-digit",
    minute: "2-digit",
  });
  return `${formattedDate} ${formattedTime}`;
};

const statusCriticalReports = [
  { label: "REJECTED", value: StatusCriticalReport.REJECTED },
  { label: "RESOLVED", value: StatusCriticalReport.RESOLVED },
  { label: "PENDING", value: StatusCriticalReport.PENDING },
];

const typsCriticalReports = [
  { label: "RESIDENT", value: TypeCriticalReport.RESIDENT },
  { label: "FEEDBACK", value: TypeCriticalReport.FEEDBACK },
  { label: "EXCHANGE", value: TypeCriticalReport.EXCHANGE },
];

export default function ReportedHistory(): JSX.Element {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const [statusFilter, setStatusFilter] = useState<StatusCriticalReport | null>(
    null
  );
  const [showStatusFilterModal, setShowStatusFilterModal] =
    useState<boolean>(false);

  const [typesFilter, setTypesFilter] = useState<TypeCriticalReport | null>(
    null
  );
  const [showTypesFilterModal, setShowTypesFilterModal] =
    useState<boolean>(false);

  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.auth);
  const { searchCriticalReport, loadingCriticalReport } = useSelector(
    (state: RootState) => state.criticalReport
  );
  const { content, pageNo, last } = searchCriticalReport;
  const isFirstRender = useRef(true);

  const searchRequest: SearchCriticalReportRequest = {};

  useEffect(() => {
    if (user?.id) {
      dispatch(
        searchCriticalReportThunk({
          pageNo: 0,
          request: searchRequest,
        })
      );
    }
  }, [user?.id]);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    const delayDebounce = setTimeout(() => {
      if (!user?.id) return;

      if (statusFilter) {
        searchRequest.statusCriticalReports = [statusFilter];
      }

      if (typesFilter) {
        searchRequest.typeReports = [typesFilter];
      }

      dispatch(
        searchCriticalReportThunk({
          pageNo: 0,
          request: searchRequest,
        })
      );
    }, 500);

    return () => clearTimeout(delayDebounce);
  }, [statusFilter, typesFilter]);

  const handleLoadMore = () => {
    if (!loadingCriticalReport && !last) {
      dispatch(
        searchCriticalReportThunk({
          pageNo: pageNo + 1,
          request: searchRequest,
        })
      );
    }
  };

  const getStatusCriticalReportedLabel = (
    status: StatusCriticalReport | undefined
  ): string => {
    const found = statusCriticalReports.find((item) => item.value === status);
    return found ? found.label : "";
  };

  const getStatusColor = (status: StatusCriticalReport): string => {
    return status === StatusCriticalReport.RESOLVED
      ? "text-green-600"
      : status === StatusCriticalReport.PENDING
      ? "text-yellow-600"
      : "text-red-600";
  };

  const getStatusBackground = (status: StatusCriticalReport): string => {
    return status === StatusCriticalReport.RESOLVED
      ? "bg-green-100"
      : status === StatusCriticalReport.PENDING
      ? "bg-yellow-100"
      : "bg-red-100";
  };

  const viewCriticalReportDetail = async (id: number) => {
    try {
      const detail = await dispatch(getCriticalReportDetailThunk(id)).unwrap();

      if (detail.typeReport === TypeCriticalReport.EXCHANGE) {
        navigation.navigate("CriticalReport", {
          typeOfReport: TypeCriticalReport.EXCHANGE,
          criticalReport: detail,
          exchangeReport: detail.exchangeRequest,
        });
      } else if (detail.typeReport === TypeCriticalReport.FEEDBACK) {
        navigation.navigate("CriticalReport", {
          typeOfReport: TypeCriticalReport.FEEDBACK,
          criticalReport: detail,
          feedbackReport: detail.feedback,
        });
      } else {
        navigation.navigate("CriticalReport", {
          typeOfReport: TypeCriticalReport.RESIDENT,
          criticalReport: detail,
          userReport: detail.resident,
        });
      }
    } catch (err) {
      Alert.alert("Error", "Something error");
    }
  };

  const renderTransaction = ({ item }: { item: CriticalReportResponse }) => (
    <View className="bg-white rounded-2xl p-4 mx-2 my-2 shadow">
      <View className="flex-row justify-between items-center mb-2">
        <Text className="text-lg text-gray-600">#ID: {item.id}</Text>
        <Text
          className={`${getStatusColor(
            item.statusCriticalReport
          )} ${getStatusBackground(
            item.statusCriticalReport
          )} py-1 px-3 rounded-full text-sm font-semibold`}
        >
          {getStatusCriticalReportedLabel(item.statusCriticalReport)}
        </Text>
      </View>

      <Text className="text-base font-semibold text-gray-800 mb-1">
        Type: {item.typeReport}
      </Text>

      <Text className="text-base text-gray-700 mb-4" numberOfLines={2}>
        Content: {item.contentReport.split("\\n")[0]}
      </Text>

      <View className="flex-col mb-4">
        <View className="flex-row items-center">
          <Feather name="clock" size={20} color="#4A5568" />
          <Text className="text-sm text-gray-600 ml-1">
            Created:{" "}
            <Text className="font-semibold">
              {formatCriticalReportDateTime(item.creationDate)}
            </Text>
          </Text>
        </View>
        <View className="flex-row items-center mt-1">
          <Feather name="user" size={20} color="#4A5568" />
          <Text className="text-sm text-gray-600 ml-1">
            Reporter:{" "}
            <Text className="font-semibold">{item.reporter.fullName}</Text>
          </Text>
        </View>
        {item.answerer && (
          <View className="flex-row items-center mt-1">
            <Feather name="user-check" size={20} color="#4A5568" />
            <Text className="text-sm text-gray-600 ml-1">
              Answered by:{" "}
              <Text className="font-semibold">{item.answerer.fullName}</Text>
            </Text>
          </View>
        )}
      </View>

      <TouchableOpacity
        onPress={() => viewCriticalReportDetail(item.id)}
        className="bg-[#00b0b9] rounded-xl py-3 items-center"
      >
        <Text className="text-white font-semibold">View Details</Text>
      </TouchableOpacity>
    </View>
  );

  const ListHeaderComponent = (
    <>
      <Header title="Critical reports" showOption={false} />

      <View className="px-4 pt-3 pb-2 bg-white">
        <View className="flex-row justify-between items-center my-2 px-3">
          <View className="flex-row items-center">
            <Feather name="alert-circle" size={20} color="#555" />
            <Text className="ml-2 text-gray-700">Status</Text>
          </View>
          <TouchableOpacity
            className="flex-row items-center"
            onPress={() => setShowStatusFilterModal(true)}
          >
            <Text className="text-[#00b0b9] font-semibold mr-1">
              {statusFilter ? statusFilter : "Select status"}
            </Text>
            <AntDesign name="down" size={12} color="#00b0b9" />
          </TouchableOpacity>
        </View>
        <View className="flex-row justify-between items-center my-2 px-3">
          <View className="flex-row items-center">
            <Feather name="file-text" size={20} color="#555" />
            <Text className="ml-2 text-gray-700">Type</Text>
          </View>
          <TouchableOpacity
            className="flex-row items-center"
            onPress={() => setShowTypesFilterModal(true)}
          >
            <Text className="text-[#00b0b9] font-semibold mr-1">
              {typesFilter ? typesFilter : "Select type"}
            </Text>
            <AntDesign name="down" size={12} color="#00b0b9" />
          </TouchableOpacity>
        </View>
      </View>
    </>
  );

  return (
    <>
      <SafeAreaView className="flex-1" edges={["top"]}>
        <FlatList
          data={content}
          renderItem={({ item }) => renderTransaction({ item })}
          keyExtractor={(item, index) => `${item.id}-${index}`}
          ListHeaderComponent={ListHeaderComponent}
          ListEmptyComponent={() => {
            if (loadingCriticalReport) {
              return (
                <View className="flex-1 justify-center items-center">
                  <ActivityIndicator size="large" color="#00b0b9" />
                </View>
              );
            }
            return (
              <View className="flex-1 justify-center items-center">
                <Icon
                  name="remove-circle-outline"
                  size={70}
                  color={"#00b0b9"}
                />
                <Text className="text-gray-500">No critical reported</Text>
              </View>
            );
          }}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.5}
          ListFooterComponent={
            loadingCriticalReport ? (
              <ActivityIndicator
                size="small"
                color="#00b0b9"
                className="my-4"
              />
            ) : null
          }
          contentContainerStyle={{ flexGrow: 1 }}
        />
      </SafeAreaView>

      <Modal
        transparent
        animationType="slide"
        visible={showStatusFilterModal}
        onRequestClose={() => setShowStatusFilterModal(false)}
      >
        <TouchableOpacity
          className="flex-1 justify-end bg-black/50"
          onPress={() => setShowStatusFilterModal(false)}
        >
          <View className="bg-white rounded-t-2xl p-6 relative">
            <Text className="text-center text-xl font-bold text-[#00b0b9]">
              Select Status
            </Text>
            <TouchableOpacity
              onPress={() => {
                setStatusFilter(null);
                setShowStatusFilterModal(false);
              }}
              className="absolute right-6 top-6"
            >
              <Text className="text-[#00b0b9] font-medium">Reset</Text>
            </TouchableOpacity>

            <Text className="text-center text-base text-gray-500 mt-1">
              Choose a status
            </Text>

            <View className="mt-4 space-y-3">
              {statusCriticalReports.map((status) => (
                <TouchableOpacity
                  key={status.label}
                  onPress={() => {
                    setStatusFilter(status.value);
                    setShowStatusFilterModal(false);
                  }}
                  className={`py-3 px-4 rounded-lg border mb-2 ${
                    statusFilter === status.value
                      ? "border-[#00b0b9] bg-[#E0F7FA]"
                      : "border-gray-200"
                  }`}
                >
                  <Text
                    className={`${
                      statusFilter === status.value
                        ? "text-[#00b0b9] font-semibold"
                        : "text-gray-800"
                    }`}
                  >
                    {status.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </TouchableOpacity>
      </Modal>

      <Modal
        transparent
        animationType="slide"
        visible={showTypesFilterModal}
        onRequestClose={() => setShowTypesFilterModal(false)}
      >
        <TouchableOpacity
          className="flex-1 justify-end bg-black/50"
          onPress={() => setShowTypesFilterModal(false)}
        >
          <View className="bg-white rounded-t-2xl p-6 relative">
            <Text className="text-center text-xl font-bold text-[#00b0b9]">
              Select Type
            </Text>
            <TouchableOpacity
              onPress={() => {
                setTypesFilter(null);
                setShowTypesFilterModal(false);
              }}
              className="absolute right-6 top-6"
            >
              <Text className="text-[#00b0b9] font-medium">Reset</Text>
            </TouchableOpacity>

            <Text className="text-center text-base text-gray-500 mt-1">
              Choose a type
            </Text>

            <View className="mt-4 space-y-3">
              {typsCriticalReports.map((type) => (
                <TouchableOpacity
                  key={type.label}
                  onPress={() => {
                    setTypesFilter(type.value);
                    setShowTypesFilterModal(false);
                  }}
                  className={`py-3 px-4 rounded-lg border mb-2 ${
                    typesFilter === type.value
                      ? "border-[#00b0b9] bg-[#E0F7FA]"
                      : "border-gray-200"
                  }`}
                >
                  <Text
                    className={`${
                      typesFilter === type.value
                        ? "text-[#00b0b9] font-semibold"
                        : "text-gray-800"
                    }`}
                  >
                    {type.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </TouchableOpacity>
      </Modal>
    </>
  );
}
